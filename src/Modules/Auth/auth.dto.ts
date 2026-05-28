import z from "zod";
import {
  confirmEmailSchema,
  forgetPasswordSchema,
  loginSchema,
  logoutSchema,
  resendOTPSchema,
  resetPasswordSchema,
  SignupSchema,
  updatePasswordSchema,
} from "./auth.validation";

export type ISignupDTO = z.infer<typeof SignupSchema.body>;
export type IConfirmEmailDTO = z.infer<typeof confirmEmailSchema.body>;
export type ILoginDTO = z.infer<typeof loginSchema.body>;
export type IResendOTPDTO = z.infer<typeof resendOTPSchema.body>;
export type IUpdatePassword = z.infer<typeof updatePasswordSchema.body>;
export type IForgetPassword = z.infer<typeof forgetPasswordSchema.body>;
export type IResetPassword = z.infer<typeof resetPasswordSchema.body>;
export type ILogoutDTO = z.infer<typeof logoutSchema.body>;
