import z from "zod";
import { generalFields } from "../../Middleware/validation.middleware";

export const deleteAccountSchema = {
  body: z.strictObject({
    otp: generalFields.otp,
  }),
};
