import nodemailer, { Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export async function sendMail(data: Mail.Options) {
  const transporter: Transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER as string,
      pass: process.env.EMAIL_PASSWORD as string,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    ...data,
    from: `"Chat Application" <${process.env.EMAIL_USER as string}>`,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
