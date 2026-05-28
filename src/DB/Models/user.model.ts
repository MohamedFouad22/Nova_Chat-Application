import { HydratedDocument, model, models, Schema, Types } from "mongoose";

export enum GenderEnum {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum RoleEnum {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface IUser {
  _id: Types.ObjectId;

  firstName: string;
  lastName: string;
  userName?: string;
  searchQuery: string;
  friends?: Types.ObjectId[];

  email: string;
  password: string;
  confirmPassword?: string;
  confirmedEmailOTP?: string;
  resetEmailOTP?: string;
  deleteAccountOTP?: string;

  profileImage?: string;
  coverImages?: string[];
  largeFiles?: string[];

  age: number;

  phone: string;
  slug: string;

  otpExpiresIn: Date;

  gender: GenderEnum;
  role: RoleEnum;

  changeCredientialsTime?: Date;

  freezedAt: Date;
  restoredAt: Date;

  freezedBy: Types.ObjectId;
  restoredBy: Types.ObjectId;

  confirmedAt: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, minLength: 2, maxLength: 25 },
    lastName: { type: String, required: true, minLength: 2, maxLength: 25 },
    searchQuery: { type: String, unique: true, required: true },

    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minLength: 8 },
    confirmedEmailOTP: String,
    resetEmailOTP: String,
    deleteAccountOTP: String,
    profileImage: String,
    coverImages: [String],
    largeFiles: [String],

    age: { type: Number, required: true },

    phone: { type: String, unique: true, required: true },

    gender: {
      type: String,
      required: true,
      default: GenderEnum.MALE,
      enum: {
        values: Object.values(GenderEnum),
        message: "Value isnot supported",
      },
    },
    role: {
      type: String,
      required: true,
      default: RoleEnum.USER,
      enum: {
        values: Object.values(RoleEnum),
        message: "Value isnot supported",
      },
    },

    changeCredientialsTime: Date,

    friends: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],

    freezedAt: Date,
    restoredAt: Date,
    confirmedAt: Date,
    otpExpiresIn: Date,

    freezedBy: Types.ObjectId,
    restoredBy: Types.ObjectId,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema
  .virtual("userName")
  .set(function (value: string) {
    const [firstName, lastName] = value.split(/\s+/) || [];
    this.firstName = firstName as string;
    this.lastName = lastName as string;
    this.slug = value.replaceAll(/\s+/g, "_");
  })
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

export const userModel = models.User || model("User", userSchema);
export type HUserDocument = HydratedDocument<IUser>;
