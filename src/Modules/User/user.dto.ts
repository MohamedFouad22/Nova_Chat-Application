import z from "zod";
import { deleteAccountSchema } from "./user.validation";

export type IDeleteAccountDTO = z.infer<typeof deleteAccountSchema.body>;
