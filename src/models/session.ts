import mongoose from "mongoose";

export interface Session {
  user?: mongoose.Types.ObjectId;
  refreshToken: string;
  createdAt?: Date;
  __v?: number;
}

export const sessionSchema = new mongoose.Schema<Session>({
  user: { type: String, ref: "users", required: true },
  refreshToken: { type: String, required: true },
  createdAt: { type: Date, required: false, default: Date.now },

  __v: { type: Number, default: 0, required: true },
});
