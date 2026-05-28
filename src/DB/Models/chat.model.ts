import { HydratedDocument, model, models, Schema, Types } from "mongoose";

export interface IMessage {
  _id?: Types.ObjectId;

  createdBy: Types.ObjectId;
  messages: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface IChat {
  _id?: Types.ObjectId;

  particantes: Types.ObjectId[];
  message: IMessage[];

  group?: string;
  groupimage?: string;
  room_id?: string;

  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export const messageSchema = new Schema<IMessage>(
  {
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: String,
  },
  {
    timestamps: true,
  },
);

export const chatSchema = new Schema<IChat>(
  {
    particantes: [
      {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    message: [messageSchema],

    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    group: String,
    groupimage: String,
    room_id: {
      type: String,
      required: function (): any {
        return this.room_id;
      },
    },
  },
  {
    timestamps: true,
  },
);

export const messageModel = models.Message || model("Message", messageSchema);
export const chatModel = models.Chat || model("Chat", chatSchema);

export type HMessageDocument = HydratedDocument<IMessage>;
export type HChatDocument = HydratedDocument<IChat>;
