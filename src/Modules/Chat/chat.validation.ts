import * as z from "zod";

export const getChatSchema = {
  params: z.strictObject({
    userId: z.string(),
  }),
  query: z.strictObject({
    page: z.coerce.number().int().min(1).optional(),
    size: z.coerce.number().int().min(5).optional(),
  }),
};
