/* import { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { decodedToken, tokenTypeEnum } from "../../Utils/Token/token.utils";
import { IAuthSocket } from "./gateway.dto";
import { ChatGateway } from "../Chat/chat.gateway";
import { BadRequestException } from "../../Utils/Response/error.response.utils";

let io: undefined | Server = undefined;

export const intiallize = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  let connectionSocket = new Map<string, string[]>();
  io.use(async (socket: IAuthSocket, next) => {
    try {
      const { user, decoded } = await decodedToken({
        authorization: socket.handshake?.auth.authorization || "",
        tokenType: tokenTypeEnum.ACCESS,
      });
      const connectionTaps = connectionSocket.get(user?._id.toString()) || [];
      connectionTaps?.push(socket.id);
      connectionSocket.set(user?._id.toString(), connectionTaps);
      socket.credentials = { user, decoded };
      next();
    } catch (error: any) {
      console.log(error.message);
    }
  });

  function disconnection(socket: IAuthSocket) {
    return socket.on("disconnect", (reason) => {
      const userId = socket.credentials?.user?._id?.toString() as string;
      let remainingTaps =
        connectionSocket.get(userId)?.filter((tap: string) => {
          return tap !== socket.id;
        }) || [];

      if (remainingTaps.length) {
        connectionSocket.set(userId, remainingTaps);
      } else {
        connectionSocket.delete(userId);
        io?.emit("offline_user", userId);
      }
      getIo().emit("offline_user", userId);
      console.log(`Disconnected :::=> Socket :::=> ${socket.id} 🚫🚫`);
      console.log({ After_Delete: connectionSocket });
    });
  }

  io.on("connection", (socket: IAuthSocket) => {
    console.log(connectionSocket);

    const chatGateway: ChatGateway = new ChatGateway();
    chatGateway.register(socket, getIo());
    disconnection(socket);
  });
};

export const getIo = (): Server => {
  if (!io) {
    throw new BadRequestException("Io Not Found");
  } else {
    return io;
  }
};
 */

import { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { decodedToken, tokenTypeEnum } from "../../Utils/Token/token.utils";
import { IAuthSocket } from "./gateway.dto";
import { ChatGateway } from "../Chat/chat.gateway";
import { BadRequestException } from "../../Utils/Response/error.response.utils";

let io: undefined | Server = undefined;

export let connectionSocket = new Map<string, string[]>();

export const intiallize = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.use(async (socket: IAuthSocket, next) => {
    try {
      const { user, decoded } = await decodedToken({
        authorization: socket.handshake?.auth.authorization || "",
        tokenType: tokenTypeEnum.ACCESS,
      });

      const connectionTaps = connectionSocket.get(user?._id.toString()) || [];
      connectionTaps.push(socket.id);
      connectionSocket.set(user?._id.toString(), connectionTaps);

      socket.credentials = { user, decoded };
      next();
    } catch (error: any) {
      console.log(error.message);
    }
  });

  function disconnection(socket: IAuthSocket) {
    return socket.on("disconnect", (reason) => {
      const userId = socket.credentials?.user?._id?.toString() as string;
      let remainingTaps =
        connectionSocket.get(userId)?.filter((tap: string) => {
          return tap !== socket.id;
        }) || [];

      if (remainingTaps.length) {
        connectionSocket.set(userId, remainingTaps);
      } else {
        connectionSocket.delete(userId);
        io?.emit("offline_user", userId);
      }
      getIo().emit("offline_user", userId);
      console.log(`Disconnected :::=> Socket :::=> ${socket.id} 🚫🚫`);
      console.log({ After_Delete: connectionSocket });
    });
  }

  io.on("connection", (socket: IAuthSocket) => {
    console.log(connectionSocket);

    const chatGateway: ChatGateway = new ChatGateway();
    chatGateway.register(socket, getIo());
    disconnection(socket);
  });
};

export const getIo = (): Server => {
  if (!io) {
    throw new BadRequestException("Io Not Found");
  } else {
    return io;
  }
};
