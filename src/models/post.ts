import mongoose from "mongoose";

export interface Post {
  user?: mongoose.Types.ObjectId;
  title: string;
  content: string;
  likes: number;
  __v?: number;
}

export const postSchema = new mongoose.Schema<Post>({
  user: { type: String, ref: "users", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  likes: { type: Number, required: true, default: 0 },

  __v: { type: Number, default: 0, required: true },
});
