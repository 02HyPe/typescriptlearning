import mongoose from "mongoose";

export interface Post {
  //   user: Object;
  user?: mongoose.Types.ObjectId;
  title: string;
  content: string;
}

export const postSchema = new mongoose.Schema<Post>({
  //   user: { type: Object, ref: "users" },
  user: { type: String, ref: "users", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
});
