import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";
import { BadRequestException } from "../Utils/Response/error.response.utils";
import z from "zod";
import { GenderEnum, RoleEnum } from "../DB/Models/user.model";

type KeyRequestType = keyof Request;
type schemaType = Partial<Record<KeyRequestType, ZodType>>;

export const validation = (schema: schemaType) => {
  return (req: Request, res: Response, next: NextFunction): NextFunction => {
    const validationError: Array<{
      key: KeyRequestType;
      issues: Array<{
        message: string;
        path: (number | symbol | string)[];
      }>;
    }> = [];
    for (const key of Object.keys(schema) as KeyRequestType[]) {
      if (!schema[key]) continue;
      const validationResult = schema[key].safeParse(req[key]);
      if (!validationResult.success) {
        const error = validationResult.error as ZodError;
        validationError.push({
          key,
          issues: error.issues.map((issue) => {
            return { message: issue.message, path: issue.path };
          }),
        });
      }
    }
    if (validationError.length > 0) {
      throw new BadRequestException("Validation Error");
    }
    return next() as unknown as NextFunction;
  };
};

export const generalFields = {
  firstName: z.string().min(1).max(25),
  lastName: z.string().min(1).max(25),
  userName: z.string().min(2).max(50),
  email: z.email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
  age: z.number(),
  phone: z.string(),
  gender: z.enum(GenderEnum).default(GenderEnum.MALE),
  role: z.enum(RoleEnum).default(RoleEnum.USER),
  otp: z.number(),
};
