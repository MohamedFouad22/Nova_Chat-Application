import { Request, Response } from "express";
import {
  IConfirmEmailDTO,
  IForgetPassword,
  ILoginDTO,
  ILogoutDTO,
  IResendOTPDTO,
  IResetPassword,
  ISignupDTO,
  IUpdatePassword,
} from "./auth.dto";
import { UserRepository } from "../../DB/Repository/user.repository";
import { IUser, RoleEnum, userModel } from "../../DB/Models/user.model";
import {
  BadRequestException,
  NotFoundException,
  UnAuthorizedException,
} from "../../Utils/Response/error.response.utils";
import { compareData, hashData } from "../../Utils/Security/Hash/hash.utils";
import { eventEmitter } from "../../Utils/Event/email.event";
import { generateOTP } from "../../Utils/Security/generateOTP.utils";
import {
  createLoginCredentials,
  createRevokedToken,
  generateToken,
  verifyToken,
} from "../../Utils/Token/token.utils";
import { v4 as uuid } from "uuid";
import { LogoutEnum } from "./auth.validation";
import { tokenModel } from "../../DB/Models/token.model";
import { TokenRepository } from "../../DB/Repository/token.repository";
import { JwtPayload } from "jsonwebtoken";
import { UpdateQuery } from "mongoose";

export class AuthenticationServices {
  private _userModel = new UserRepository(userModel);
  private _tokenModel = new TokenRepository(tokenModel);

  constructor() {}

  signup = async (req: Request, res: Response): Promise<Response> => {
    const {
      userName,
      email,
      password,
      confirmPassword,
      age,
      phone,
      gender,
      role,
    }: ISignupDTO = req.body;

    const checkUser = await this._userModel.findOne({
      filter: { email },
    });
    if (checkUser) throw new BadRequestException("User already exists");

    const otp = generateOTP();

    const [user] = await this._userModel.create({
      data: [
        {
          userName,
          email,
          password: await hashData(password),
          age,
          phone,
          gender,
          role,
          confirmedEmailOTP: await hashData(otp),
          otpExpiresIn: new Date(Date.now() + 5 * 60 * 1000),
          searchQuery:
            "@" +
            userName +
            Math.floor(Math.random() * 5000 + Date.now() / 100000000),
        },
      ],
    });
    if (!user) throw new BadRequestException("Failed to create account");

    eventEmitter.emit("confirmEmail", {
      to: user.email,
      otp,
      firstName: userName,
    });

    return res
      .status(201)
      .json({ message: "User Created Successfully", data: { user } });
  };

  resendOTP = async (req: Request, res: Response): Promise<Response> => {
    const { email }: IResendOTPDTO = req.body;

    const otp = generateOTP();

    const checkUser = await this._userModel.findOne({
      filter: {
        email,
        $or: [
          { confirmedEmailOTP: { $exists: true } },
          { resetEmailOTP: { $exists: true } },
          { deleteAccountOTP: { $exists: true } },
        ],
      },
    });
    if (!checkUser)
      throw new BadRequestException(
        "Not Found Email Or Email Already Confirmed",
      );

    if (checkUser.confirmedEmailOTP) {
      await this._userModel.updateOne({
        filter: { email },
        update: {
          confirmedEmailOTP: await hashData(otp),
          otpExpiresIn: new Date(Date.now() + 5 * 60 * 1000),
        },
      });

      eventEmitter.emit("confirmEmail", {
        to: email,
        otp,
        firstName: checkUser?.userName,
      });
    } else if (checkUser.resetEmailOTP) {
      await this._userModel.updateOne({
        filter: { email, resetEmailOTP: { $exists: true } },
        update: {
          resetEmailOTP: await hashData(otp),
          otpExpiresIn: new Date(Date.now() + 5 * 60 * 1000),
        },
      });
      eventEmitter.emit("resetPassword", {
        to: email,
        otp,
        firstName: checkUser?.userName,
      });
    } else if (checkUser.deleteAccountOTP) {
      await this._userModel.updateOne({
        filter: { email },
        update: {
          deleteAccountOTP: await hashData(otp),
          otpExpiresIn: new Date(Date.now() + 5 * 60 * 1000),
        },
      });
      eventEmitter.emit("deleteAccount", {
        to: email,
        otp,
        firstName: checkUser?.userName,
      });
    } else {
      throw new BadRequestException("Failed To Resend OTP");
    }

    return res.status(200).json({ message: "Resend OTP Successfully" });
  };

  confirmEmail = async (req: Request, res: Response): Promise<Response> => {
    const { email, otp }: IConfirmEmailDTO = req.body;

    const checkUser = await this._userModel.findOne({
      filter: {
        email,
        confirmedEmailOTP: { $exists: true },
        confirmedAt: { $exists: false },
        otpExpiresIn: { $exists: true },
      },
    });
    if (!checkUser)
      throw new BadRequestException(
        "Must Signup First Or Email Already Confirmed",
      );

    if ((checkUser?.otpExpiresIn).getTime() < Date.now()) {
      throw new BadRequestException("OTP Expired");
    }

    const user = await this._userModel.updateOne({
      filter: {
        email,
      },
      update: {
        confirmedAt: new Date(),
        $unset: { confirmedEmailOTP: true },
        $inc: { __v: 1 },
      },
    });
    if (!user)
      throw new BadRequestException(
        "Failed To Confirm Email Or Email Already Confirmed",
      );

    eventEmitter.emit("welcome", { to: email, firstName: checkUser.userName });

    return res
      .status(200)
      .json({ message: "Confirm Email Done Successfully", data: { user } });
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password }: ILoginDTO = req.body;

    const checkUser = await this._userModel.findOne({
      filter: {
        email,
        confirmedAt: { $exists: true },
        confirmedEmailOTP: { $exists: false },
        freezedAt: { $exists: false },
        freezedBy: { $exists: false },
      },
    });
    if (!checkUser)
      throw new BadRequestException("Invalid Email Or Email Not Confirmed");

    if (!(await compareData(password, checkUser.password))) {
      throw new BadRequestException("Password Not Match");
    }

    const credentials = await createLoginCredentials(checkUser);

    return res.status(200).json({
      message: "Login Done Successfully",
      credentials,
    });
  };

  refreshToken = async (req: Request, res: Response): Promise<Response> => {
    const { authorization } = req.headers;

    const decoded = await verifyToken({
      token: authorization?.split(" ")[1] as string,
      secretKey: process.env.REFRESH_USER_TOKEN_SECRET as string,
    });
    if (!decoded) throw new UnAuthorizedException("Invalid Token");

    let accessToken: string;
    if (decoded?.role === RoleEnum.USER) {
      accessToken = await generateToken({
        payload: {
          _id: decoded?._id,
          email: decoded?.email,
          name: decoded?.name,
          role: decoded?.role,
        },
        secretKey: process.env.ACCESS_USER_TOKEN_SECRET as string,
        options: {
          expiresIn: Number(process.env.ACCESS_KEY_EXPIRES_IN),
          jwtid: uuid(),
        },
      });
    } else {
      accessToken = await generateToken({
        payload: {
          _id: decoded?._id,
          email: decoded?.email,
          name: decoded?.name,
          role: decoded?.role,
        },
        secretKey: process.env.ACCESS_ADMIN_TOKEN_SECRET as string,
        options: {
          expiresIn: Number(process.env.ACCESS_KEY_EXPIRES_IN),
          jwtid: uuid(),
        },
      });
    }

    return res.status(200).json({
      message: "Refresh Token Successfully",
      credential: { accessToken },
    });
  };

  updatePassword = async (req: Request, res: Response): Promise<Response> => {
    const { password, newPassword, confirmPassword }: IUpdatePassword =
      req.body;

    const checkUser = await this._userModel.findById({
      id: req.user?._id,
    });
    if (!checkUser) throw new NotFoundException("User Not Found");

    if (!(await compareData(password, checkUser.password)))
      throw new BadRequestException("Password Not Match");

    if (newPassword !== confirmPassword) {
      throw new BadRequestException(
        "The password is not the same. Please check again",
      );
    }

    if (await compareData(newPassword, checkUser.password))
      throw new BadRequestException("This Password Already You Use Now");

    const updateUser = await this._userModel.findOneAndUpdate({
      filter: {
        email: req.decoded?.email,
      },
      update: {
        password: await hashData(newPassword),
        $inc: { __v: 1 },
      },
    });
    if (!updateUser) throw new BadRequestException("Failed To Update Password");

    eventEmitter.emit("updatePassword", {
      to: req.decoded?.email,
      firstName: req.decoded?.name,
    });
    return res
      .status(200)
      .json({ message: "Updated Password Done Successfully" });
  };

  forgetPassword = async (req: Request, res: Response): Promise<Response> => {
    const { email }: IForgetPassword = req.body;
    const otp = generateOTP();

    const checkUser = await this._userModel.findOneAndUpdate({
      filter: {
        email,
      },
      update: {
        resetEmailOTP: await hashData(otp),
        otpExpiresIn: new Date(Date.now() + 5 * 60 * 1000),
        $inc: { __v: 1 },
      },
    });
    if (!checkUser) throw new NotFoundException("User Not Found");

    eventEmitter.emit("resetPassword", {
      to: email,
      otp,
      firstName: checkUser.userName,
    });

    return res.status(200).json({
      message:
        "The OTP for resetting the password has been sent. Please check your inbox",
    });
  };

  resetPassword = async (req: Request, res: Response): Promise<Response> => {
    const { email, otp, password }: IResetPassword = req.body;

    const checkUser = await this._userModel.findOne({
      filter: {
        email,
        resetEmailOTP: { $exists: true },
        otpExpiresIn: { $exists: true },
      },
    });
    if (!checkUser) throw new NotFoundException("User Not Found");

    if (checkUser.otpExpiresIn.getTime() < Date.now()) {
      throw new BadRequestException("OTP Expired");
    }

    if (!(await compareData(otp.toString(), checkUser.resetEmailOTP)))
      throw new BadRequestException("Invalid OTP Or OTP Expired");

    if (await compareData(password, checkUser.password))
      throw new BadRequestException(
        "The password is not the same. Please check again",
      );

    const updateUser = await this._userModel.updateOne({
      filter: { email },
      update: {
        $unset: { resetEmailOTP: true, otpExpiresIn: true },
        password: await hashData(password),
        $inc: { __v: 1 },
      },
    });
    if (!updateUser) throw new BadRequestException("Failed To Reset Password");

    eventEmitter.emit("resetPasswordAlert", {
      to: email,
      firstName: checkUser.userName,
    });
    return res.status(200).json({ message: "Reset Password Successfully" });
  };

  logout = async (req: Request, res: Response): Promise<Response> => {
    const { flag }: ILogoutDTO = req.body;

    let statusCode = 200;
    const update: UpdateQuery<IUser> = {};

    switch (flag) {
      case LogoutEnum.ONLY:
        await createRevokedToken(req.decoded as JwtPayload);

        statusCode = 201;
        break;

      case LogoutEnum.ALL:
        update.changeCredientialsTime = new Date();
        break;

      default:
        break;
    }

    await this._userModel.updateOne({
      filter: { _id: req.decoded?._id },
      update,
    });

    return res.status(statusCode).json({ message: "Logout Successfully" });
  };
}

export default new AuthenticationServices();
