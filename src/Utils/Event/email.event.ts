import { EventEmitter } from "node:events";
import { template } from "../Email/confirm.email.template";
import { sendMail } from "../Email/send.email.utils";
import Mail from "nodemailer/lib/mailer";
import { Welcometemplate } from "../Email/welcome.email.template";
import { PasswordChangeTemplate } from "../Email/update.password.alert.template";
import { ResetPasswordTemplate } from "../Email/reset.password.email";
import { ResetSuccessAlertTemplate } from "../Email/reset.password.alert.template";
import { DeleteAccountAlertTemplate } from "../Email/delete.account.template";
import { DeleteAccountOTPTemplate } from "../Email/delete.account.email.template";

export const eventEmitter = new EventEmitter();

export interface IEmail extends Mail.Options {
  otp: number;
  firstName: string;
}

eventEmitter.on("confirmEmail", async (data: IEmail) => {
  try {
    data.subject = SubjectEnum.CONFIRM_EMAIL;
    data.html = template(data.otp, data.firstName, SubjectEnum.CONFIRM_EMAIL);
    await sendMail(data);
  } catch (error) {
    console.log("Failed To Sent Confirm Email");
  }
});

eventEmitter.on("welcome", async (data: IEmail) => {
  try {
    data.subject = SubjectEnum.WELCOME_EMAIL;
    data.html = Welcometemplate(data.firstName, SubjectEnum.WELCOME_EMAIL);
    await sendMail(data);
  } catch (error) {
    console.log("Failed To Sent Confirm Email");
  }
});

eventEmitter.on("updatePassword", async (data: IEmail) => {
  try {
    data.html = PasswordChangeTemplate(
      data.firstName,
      SubjectEnum.UPDATE_PASSWORD_ALERT,
    );
    data.subject = SubjectEnum.UPDATE_PASSWORD_ALERT;
    await sendMail(data);
  } catch (error) {
    console.log("Failed To Sent Alert Email");
  }
});

eventEmitter.on("resetPassword", async (data: IEmail) => {
  try {
    data.html = ResetPasswordTemplate(
      data.otp,
      data.firstName,
      SubjectEnum.RESET_PASSWORD,
    );
    data.subject = SubjectEnum.RESET_PASSWORD;
    await sendMail(data);
  } catch (error) {
    console.log("Failed To Sent Reset Password Email");
  }
});

eventEmitter.on("resetPasswordAlert", async (data: IEmail) => {
  try {
    data.html = ResetSuccessAlertTemplate(
      data.firstName,
      SubjectEnum.RESET_PASSWORD_ALERT,
    );
    data.subject = SubjectEnum.RESET_PASSWORD_ALERT;
    await sendMail(data);
  } catch (error) {
    console.log("Failed To Sent Reset Password Alert Email");
  }
});

eventEmitter.on("deleteAccountAlert", async (data: IEmail) => {
  try {
    data.subject = SubjectEnum.DELETE_ACCOUNT_ALERT;
    data.html = DeleteAccountAlertTemplate(
      data.firstName,
      SubjectEnum.DELETE_ACCOUNT_ALERT,
    );
    await sendMail(data);
  } catch (error) {
    console.log("Failed To Sent Delete Account Alert Email");
  }
});

eventEmitter.on("deleteAccount", async (data: IEmail) => {
  try {
    data.subject = SubjectEnum.DELETE_ACCOUNT;
    data.html = DeleteAccountOTPTemplate(
      data.otp,
      data.firstName,
      SubjectEnum.DELETE_ACCOUNT,
    );
    await sendMail(data);
  } catch (error) {
    console.log("Failed To Sent Delete Account Email");
  }
});

export enum SubjectEnum {
  WELCOME_EMAIL = "Welcome To Chat Application",
  CONFIRM_EMAIL = "Please Confirm Your Email",
  UPDATE_PASSWORD_ALERT = "Your Password Change",
  RESET_PASSWORD = "Reset your Chat App password",
  RESET_PASSWORD_ALERT = "Your Password Change",
  DELETE_ACCOUNT = "Account Deletion Confirmation",
  DELETE_ACCOUNT_ALERT = "Your account has been deleted. We await your return as soon as possible",
}
