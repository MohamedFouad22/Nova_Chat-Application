import { NextFunction, Request, Response } from "express";

export class ApplicationException extends Error {
  constructor(
    message: string,
    public statusCode: number,
    options?: ErrorOptions,
  ) {
    super(message, options);
    ((this.name = this.constructor.name), (this.statusCode = statusCode));
  }
}

export class BadRequestException extends ApplicationException {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 400, options);
  }
}

export class UnAuthorizedException extends ApplicationException {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 401, options);
  }
}

export class ForbiddenException extends ApplicationException {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 403, options);
  }
}

export class NotFoundException extends ApplicationException {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 404, options);
  }
}

export class ConfilctException extends ApplicationException {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 409, options);
  }
}

export interface IError extends Error {
  statusCode: number;
}

export const globalError = async (
  error: IError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = error.statusCode ?? 500;
  return res.status(statusCode).json({
    cause: error.cause,
    stack: process.env.MODE === "DEV" ? error.stack : undefined,
    message: "Something Went Wrong",
  });
};
