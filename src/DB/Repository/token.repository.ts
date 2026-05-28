import { Model } from "mongoose";
import { IToken } from "../Models/token.model";
import { DataBaseRepository } from "./database.repository";

export class TokenRepository extends DataBaseRepository<IToken> {
  constructor(protected override readonly model: Model<IToken>) {
    super(model);
  }
}
