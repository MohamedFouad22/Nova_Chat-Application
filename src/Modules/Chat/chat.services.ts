import { Types } from "mongoose";
import { chatModel } from "../../DB/Models/chat.model";
import { userModel } from "../../DB/Models/user.model";
import { ChatRepository } from "../../DB/Repository/chat.repository";
import { UserRepository } from "../../DB/Repository/user.repository";
import {
  BadRequestException,
  NotFoundException,
} from "../../Utils/Response/error.response.utils";
import {
  IGetChatDTO,
  IGetChatQueryDTO,
  ISayHi,
  ISendMessage,
} from "./chat.dto";
import { Request, Response } from "express";

export class ChatServices {
  private _userModel = new UserRepository(userModel);
  private _chatModel = new ChatRepository(chatModel);
  constructor() {}

  getChat = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params as IGetChatDTO;
    const { page, size }: IGetChatQueryDTO = req.query;
    const createdBy = req.user?._id;
    const targetUserId = Types.ObjectId.createFromHexString(userId);
    const findUser = await this._chatModel.findOneChat({
      filter: {
        particantes: {
          $all: [createdBy as Types.ObjectId, targetUserId],
        },
        group: { $exists: false },
      },
      options: {
        populate: [
          {
            path: "particantes",
            select: "userName email gender profileImage firstName lastName",
          },
        ],
      },
      page,
      size,
    });

    if (!findUser) {
      return res.status(200).json({
        message: "No history found, start chatting!",
        data: { chat: { message: [], particantes: [] } },
      });
    }
    return res
      .status(200)
      .json({ message: "Get Chat Successfully", data: { chat: findUser } });
  };

  sayHi = ({ message, socket, callback, io }: ISayHi) => {
    try {
      console.log({ message });
      callback ? callback("Hi From sayHi Fun 💫💫") : undefined;
    } catch (error) {
      socket.emit("custom_error", error);
    }
  };

  sendMessage = async ({
    socket,
    io,
    sendTo,
    messages,
    content,
    connectionSocket,
  }: ISendMessage) => {
    try {
      const createdBy =
        socket.credentials?.user &&
        (socket.credentials?.user._id as Types.ObjectId);

      const checkReceiver = await this._userModel.findOne({
        filter: {
          _id: Types.ObjectId.createFromHexString(sendTo),
        },
      });
      if (!checkReceiver) throw new NotFoundException("User Not Found");

      const chat = await this._chatModel.findOneAndUpdate({
        filter: {
          particantes: {
            $all: [
              createdBy as Types.ObjectId,
              Types.ObjectId.createFromHexString(sendTo),
            ],
          },
          group: { $exists: false },
        },
        update: {
          $addToSet: { message: [{ createdBy, messages: content }] },
        },
      });
      if (!chat) {
        const [newChat] =
          (await this._chatModel.create({
            data: [
              {
                createdBy,
                message: [{ createdBy, messages: content }],
                particantes: [
                  createdBy as Types.ObjectId,
                  Types.ObjectId.createFromHexString(sendTo),
                ],
              },
            ],
          })) || [];
        if (!newChat)
          throw new BadRequestException("Failed To Create New Chat");
      }

      const addSenderFriend = await this._userModel.findOneAndUpdate({
        filter: {
          _id: createdBy as Types.ObjectId,
        },
        update: {
          $addToSet: {
            friends: Types.ObjectId.createFromHexString(sendTo),
          },
        },
      });

      const addReceiverFriend = await this._userModel.findOneAndUpdate({
        filter: {
          _id: Types.ObjectId.createFromHexString(sendTo),
        },
        update: {
          $addToSet: {
            friends: createdBy as Types.ObjectId,
          },
        },
      });

      if (!addSenderFriend || !addReceiverFriend)
        throw new BadRequestException("Failed To Add Friend");

      io?.to(
        connectionSocket.get(createdBy?.toString() as string) as string[],
      ).emit("successMessage", {
        content: content,
      });

      io?.to(
        connectionSocket.get(sendTo.toString() as string) as string[],
      ).emit("newMessage", {
        fromId: createdBy,
        content: content,
        sender: { _id: createdBy },
      });
    } catch (error) {
      socket.emit("custom_error", error);
      console.log(error);
    }
  };
}

export default new ChatServices();
