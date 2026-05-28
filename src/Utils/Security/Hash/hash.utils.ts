import { compare, hash } from "bcrypt";

export const hashData = async (
  plaintext: string = "",
  saltRound: number = Number(process.env.SALT_ROUND),
) => {
  return await hash(plaintext, saltRound);
};

export const compareData = async (
  plaintext: string = "",
  hash: string = "",
) => {
  return await compare(plaintext, hash);
};
