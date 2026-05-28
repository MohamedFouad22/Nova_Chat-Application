import { NextFunction, Request, Response } from "express";
import { decodedToken, tokenTypeEnum } from "../Utils/Token/token.utils";
import {
  ForbiddenException,
  UnAuthorizedException,
} from "../Utils/Response/error.response.utils";
import { RoleEnum } from "../DB/Models/user.model";

export const authentication = (
  tokenType: tokenTypeEnum = tokenTypeEnum.ACCESS,
  accessRoles: RoleEnum[] = [],
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization)
      throw new UnAuthorizedException("Missing authorization");

    const { decoded, user } = await decodedToken({
      authorization: req.headers.authorization,
      tokenType,
    });

    if (!accessRoles.includes(user.role))
      throw new ForbiddenException("You are not authorized to access");

    req.user = user;
    req.decoded = decoded;
    return next();
  };
};
