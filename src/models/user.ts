import mongoose from "mongoose";

export interface User {
  userName: string;
  email: string;
  password: string;
  __v?: number;
}

export const userSchema = new mongoose.Schema<User>(
  {
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    __v: { type: Number, default: 0, required: true },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.virtual("useremail").get(function () {
  return this.userName + " " + this.email;
});
