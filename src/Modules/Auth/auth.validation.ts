import z from "zod";
import { generalFields } from "../../Middleware/validation.middleware";

export enum LogoutEnum {
  ALL = "ALL",
  ONLY = "ONLY",
}

export const SignupSchema = {
  body: z
    .strictObject({
      userName: generalFields.userName,
      email: generalFields.email,
      password: generalFields.password,
      confirmPassword: generalFields.password,
      age: generalFields.age,
      phone: generalFields.phone,
      gender: generalFields.gender,
      role: generalFields.role,
    })
    .superRefine((value, ctx) => {
      if (value.password !== value.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "Password Not Match",
        });
      }

      if (value.userName.split(" ").length !== 2) {
        ctx.addIssue({
          code: "custom",
          path: ["userName"],
          message: "User name must be 2 name",
        });
      }
    }),
};

export const confirmEmailSchema = {
  body: z.strictObject({
    email: generalFields.email,
    otp: generalFields.otp,
  }),
};

export const loginSchema = {
  body: z.strictObject({
    email: generalFields.email,
    password: generalFields.password,
  }),
};

export const resendOTPSchema = {
  body: z.strictObject({
    email: generalFields.email,
  }),
};

export const updatePasswordSchema = {
  body: z.strictObject({
    password: generalFields.password,
    newPassword: generalFields.password,
    confirmPassword: generalFields.password,
  }),
};

export const forgetPasswordSchema = {
  body: z.strictObject({
    email: generalFields.email,
  }),
};

export const resetPasswordSchema = {
  body: z.strictObject({
    email: generalFields.email,
    otp: generalFields.otp,
    password: generalFields.password,
  }),
};

export const logoutSchema = {
  body: z.strictObject({
    flag: z.enum(LogoutEnum).default(LogoutEnum.ONLY),
  }),
};
