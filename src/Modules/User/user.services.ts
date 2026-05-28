import { Request, Response } from "express";
import { eventEmitter } from "../../Utils/Event/email.event";
import { UserRepository } from "../../DB/Repository/user.repository";
import { RoleEnum, userModel } from "../../DB/Models/user.model";
import {
  BadRequestException,
  NotFoundException,
  UnAuthorizedException,
} from "../../Utils/Response/error.response.utils";
import { generateOTP } from "../../Utils/Security/generateOTP.utils";
import { compareData, hashData } from "../../Utils/Security/Hash/hash.utils";
import { IDeleteAccountDTO } from "./user.dto";
import {
  deleteFile,
  deleteFiles,
  uploadFile,
  uploadFiles,
  uploadLargeFiles,
} from "../../Utils/Multer/s3.config";

class UserServices {
  private _userModel = new UserRepository(userModel);
  constructor() {}

  searchUser = async (req: Request, res: Response) => {
    try {
      const { searchQuery } = req.body;

      if (!searchQuery) {
        return res.status(400).json({ message: "Search query is required" });
      }

      const cleanQuery = String(searchQuery).trim();

      const user = await this._userModel.findOne({
        filter: {
          searchQuery: { $regex: new RegExp("^" + cleanQuery + "$", "i") },
        },
        options: {
          select: "-password",
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  };

  getProfile = async (req: Request, res: Response): Promise<Response> => {
    const user = await this._userModel.findById({
      id: req.decoded?._id,
      options: {
        populate: [
          {
            path: "friends",
            select: "userName  profileImage firstName lastName email",
          },
        ],
      },
    });
    if (!user) throw new BadRequestException("Failed To Get Profile");

    return res
      .status(200)
      .json({ message: "Get Profile Successfully", data: { user } });
  };

  freezedAccount = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params;

    if (userId && req.user?.role !== RoleEnum.ADMIN) {
      throw new UnAuthorizedException("Not Authorized To Freezed Account");
    }

    const user = await this._userModel.findOneAndUpdate({
      filter: {
        _id: userId ? userId : req.decoded?._id,
        freezedAt: { $exists: false },
        freezedBy: { $exists: false },
      },
      update: {
        freezedAt: new Date(),
        freezedBy: req.decoded?._id,
      },
    });
    if (!user)
      throw new NotFoundException("User Not Found Or Account Already Freezed");

    return res.status(200).json({
      message: "Account Freezed Successfully",
      data: { email: user.email },
    });
  };

  restoredAccount = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params;

    if (userId && req.decoded?.role !== RoleEnum.ADMIN)
      throw new UnAuthorizedException("Unauthorized To Restore Account");

    const user = await this._userModel.findOneAndUpdate({
      filter: {
        _id: userId ? userId : req.decoded?._id,
        freezedAt: { $exists: true },
        freezedBy: { $exists: true },
      },
      update: {
        $unset: { freezedAt: true, freezedBy: true },
        restoredAt: new Date(),
        restoredBy: req.decoded?._id,
        $inc: { __v: 1 },
      },
    });
    if (!user) throw new NotFoundException("User Not Found");

    return res.status(200).json({
      message: "Account Restored Successfully",
      data: { email: user.email },
    });
  };

  profileImage = async (req: Request, res: Response): Promise<Response> => {
    const key = await uploadFile({
      path: `Users/Profile Image/${req.decoded?._id}`,
      file: req.file as Express.Multer.File,
    });

    await this._userModel.updateOne({
      filter: { _id: req.decoded?._id },
      update: {
        profileImage: key,
        $inc: { __v: 1 },
      },
    });

    return res.status(200).json({
      message: "Profile Image Uploaded Successfully",
      ProfileImage: { key },
    });
  };

  coverImages = async (req: Request, res: Response): Promise<Response> => {
    const urls = await uploadFiles({
      path: `Users/Cover Images/${req.decoded?._id}`,
      files: req.files as Express.Multer.File[],
    });

    await this._userModel.updateOne({
      filter: { _id: req.decoded?._id },
      update: {
        coverImages: urls,
        $inc: { __v: 1 },
      },
    });

    return res.status(200).json({
      message: "Cover Images Uploaded Successfully",
      data: { urls },
    });
  };

  largeFiles = async (req: Request, res: Response): Promise<Response> => {
    const key = await uploadLargeFiles({
      path: `Users/Large Files/${req.decoded?._id}`,
      files: req.files as Express.Multer.File[],
    });

    await this._userModel.findOneAndUpdate({
      filter: { _id: req.decoded?._id },
      update: {
        largeFiles: key,
        $inc: { __v: 1 },
      },
    });

    return res.status(200).json({
      message: "Large File Uploaded Successfully",
      data: { key },
    });
  };

  deleteAwsFile = async (req: Request, res: Response): Promise<Response> => {
    const { key } = req.query as unknown as { key: string };

    const result = await deleteFile({ Key: key as string });

    return res.status(200).json({
      message: "Delete File Successfully",
      data: { result },
    });
  };

  deleteAwsFiles = async (req: Request, res: Response): Promise<Response> => {
    const { urls } = req.body;
    const result = await deleteFiles({
      urls,
    });

    return res.status(200).json({
      message: "Delete File Successfully",
      data: { result },
    });
  };

  deleteAccountRequest = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const otp = generateOTP();

    const checkUser = await this._userModel.findOneAndUpdate({
      filter: {
        email: req.decoded?.email,
      },
      update: {
        deleteAccountOTP: await hashData(otp),
        otpExpiresIn: new Date(Date.now() + 5 * 60 * 1000),
      },
    });
    if (!checkUser) throw new NotFoundException("User Not Found");

    eventEmitter.emit("deleteAccount", {
      to: checkUser.email,
      otp,
      firstName: req.decoded?.name,
    });
    return res.status(200).json({
      message:
        "The OTP for delete the account has been sent , Please check your inbox",
    });
  };

  deleteAccount = async (req: Request, res: Response): Promise<Response> => {
    const { otp }: IDeleteAccountDTO = req.body;

    if (!(await compareData(otp.toString(), req.user?.deleteAccountOTP)))
      throw new BadRequestException("Invalid OTP");

    if (req.user?.otpExpiresIn && req.user?.otpExpiresIn.getTime() < Date.now())
      throw new BadRequestException("OTP Expired");

    const checkUser = await this._userModel.findOneAndDelete({
      filter: {
        email: req.decoded?.email,
        deleteAccountOTP: { $exists: true },
        otpExpiresIn: { $exists: true },
      },
    });
    if (!checkUser) throw new BadRequestException("Failed To Delete Account");

    eventEmitter.emit("deleteAccountAlert", {
      to: checkUser.email,
      firstName: req.decoded?.name,
    });
    return res.status(200).json({ message: "Account Deleted Successfullys" });
  };
}

export default new UserServices();
