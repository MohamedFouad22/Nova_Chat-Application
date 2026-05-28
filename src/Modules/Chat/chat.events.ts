import { Server } from "socket.io";
import { IAuthSocket } from "../getway/gateway.dto";
import { Types } from "mongoose";
import { ChatServices } from "./chat.services";
import { connectionSocket } from "../getway/getway"; // تأكد من صحة المسار لملف الـ gateway الأساسي

export class ChatEvent {
  private _chatServices = new ChatServices();
  constructor() {}

  sayHi = (socket: IAuthSocket, io: Server) => {
    socket.on("sayHi", (data, callback, io) => {
      console.log({ data });
      callback("Hello From Backend To Frontend 🙌🙌");
    });
  };

  sendMessage = (socket: IAuthSocket, io: Server) => {
    return socket.on(
      "sendMessage",
      (data: {
        createdBy?: Types.ObjectId;
        messages: string;
        content: string;
        sendTo: string;
      }) => {
        return this._chatServices.sendMessage({
          ...data,
          socket,
          io,
          connectionSocket,
        });
      },
    );
  };
  
}

export default new ChatEvent();
