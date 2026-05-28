import { Model } from "mongoose";
import { IUser } from "../Models/user.model";
import { DataBaseRepository } from "./database.repository";

export class UserRepository extends DataBaseRepository<IUser> {
  constructor(protected override readonly model: Model<IUser>) {
    super(model);
  }
}
