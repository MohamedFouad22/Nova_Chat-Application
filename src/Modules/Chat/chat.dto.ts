import { Server } from "socket.io";
import { IAuthSocket } from "../getway/gateway.dto";
import { Types } from "mongoose";
import * as z from "zod";
import { getChatSchema } from "./chat.validation";

export interface ISayHi {
  message: string;
  socket: IAuthSocket;
  callback: any;
  io?: Server;
}

export interface ISendMessage {
  socket: IAuthSocket;
  callback?: any;
  io?: Server;
  createdBy?: Types.ObjectId | undefined;
  sendTo: string;
  messages: string;
  content?: string;
  connectionSocket: Map<string, string[]>;
}

export type IGetChatDTO = z.infer<typeof getChatSchema.params>;
export type IGetChatQueryDTO = z.infer<typeof getChatSchema.query>;
