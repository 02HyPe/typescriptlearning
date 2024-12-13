import mongoose from "mongoose";

export interface Interaction {
  user?: mongoose.Types.ObjectId;
  post?: mongoose.Types.ObjectId;
  likes: string[];
  views: number;
  createdAt: Date;
  __v?: number;
}

export const interactionSchema = new mongoose.Schema<Interaction>({
  user: { type: String, ref: "users", required: true },
  post: { type: String, ref: "posts", required: true },
  likes: { type: [String], required: true },
  views: { type: Number, default: 0, required: true },
  __v: { type: Number, default: 0, required: true },
});
