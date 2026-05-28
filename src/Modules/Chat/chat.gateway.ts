import { Server } from "socket.io";
import { IAuthSocket } from "../getway/gateway.dto";
import { ChatEvent } from "./chat.events";

export class ChatGateway {
  private chatEvent = new ChatEvent();
  constructor() {}

  register = (socket: IAuthSocket, io: Server) => {
    this.chatEvent.sayHi(socket, io);
    this.chatEvent.sendMessage(socket, io);
  };
}

export default new ChatGateway();
