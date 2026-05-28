import express, { Express, Request, Response } from "express";
import { connectionDB } from "./DB/connection.db";
import path from "node:path";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRouter from "./Modules/Auth/auth.controller";
import userRouter from "./Modules/User/user.controller";
import chatRouter from "./Modules/Chat/chat.controller";
import { globalError } from "./Utils/Response/error.response.utils";
import { intiallize } from "./Modules/getway/getway";
dotenv.config({ path: path.resolve("./config/.env.dev") });

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  statusCode: 429,
  limit: 500,
  message: "You Sent Many Requests , Please Try Later",
});

export const bootstrap = async () => {
  const port: number = Number(process.env.PORT) || 5000;
  const app: Express = express();
  app.use(express.json(), cors(), helmet(), limiter);

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/chat", chatRouter);

  await connectionDB();

  app.use((req: Request, res: Response, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  });

  app.get("/", (req: Request, res: Response) => {
    return res
      .status(200)
      .json({ message: `Welcome To ${process.env.APPLICATION_NAME}` });
  });

  app.all("/*dummy", (req: Request, res: Response) => {
    return res.status(404).json({ message: "Page Not Found" });
  });

  const httpServer = app.listen(port, () => {
    console.log(`Server is running on : http://localhost:${port} ✈️`);
  });

  app.use(globalError);
  intiallize(httpServer);
};
