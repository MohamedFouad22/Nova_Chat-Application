import { HydratedDocument, model, models, Schema, Types } from "mongoose";

export interface IToken {
  _id: Types.ObjectId;

  jwtid: string;
  expiresIn: Date;
  userId: Types.ObjectId;

  createdBy: Date;
  updatedAt?: Date;
}

export const tokenSchema = new Schema<IToken>(
  {
    jwtid: {
      type: String,
      required: true,
    },
    expiresIn: {
      type: Date,
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export const tokenModel = models.Token || model("Token", tokenSchema);
export type HTokenDocument = HydratedDocument<IToken>;
