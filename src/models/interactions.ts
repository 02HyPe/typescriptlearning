import mongoose from "mongoose";

export interface Interaction {
  user?: mongoose.Types.ObjectId;
  post?: mongoose.Types.ObjectId;
  comment: string;
  views: number;
  createdAt: Date;
}

export const postSchema = new mongoose.Schema<Interaction>({
  user: { type: String, ref: "users", required: true },
  post: { type: String, ref: "posts", required: true },
  comment: { type: String, required: true },
  views: { type: Number, required: true },
});
