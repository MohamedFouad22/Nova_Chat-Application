import { Router } from "express";
const router = Router();
import authServices from "./auth.services";
import { authentication } from "../../Middleware/authentication.middleware";
import { tokenTypeEnum } from "../../Utils/Token/token.utils";
import { RoleEnum } from "../../DB/Models/user.model";
import rateLimit from "express-rate-limit";

export const otpRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 1,
  message: {
    message: "Too many OTP requests, please try again after 5 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/signup", authServices.signup);
router.patch("/confirm-email", authServices.confirmEmail);
router.post("/login", authServices.login);
router.patch("/resend-otp", otpRateLimiter, authServices.resendOTP);
router.post("/refresh-token", authServices.refreshToken);
router.patch(
  "/update-password",
  authentication(tokenTypeEnum.ACCESS, [RoleEnum.USER, RoleEnum.ADMIN]),
  authServices.updatePassword,
);
router.post("/forget-password", authServices.forgetPassword);
router.patch("/reset-password", authServices.resetPassword);
router.post(
  "/logout",
  authentication(tokenTypeEnum.ACCESS, [RoleEnum.ADMIN, RoleEnum.USER]),
  authServices.logout,
);
export default router;
