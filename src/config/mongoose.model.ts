import mongoose from "mongoose";
import { User, userSchema } from "../models/user";
import { Post, postSchema } from "../models/post";
import { Session, sessionSchema } from "../models/session";
import { Interaction, interactionSchema } from "../models/interactions";

export const postModel = mongoose.model<Post>("posts", postSchema, "posts");
export const userModel = mongoose.model<User>("users", userSchema, "users");
export const sessionModel = mongoose.model<Session>(
  "session",
  sessionSchema,
  "session"
);
export const interactionModel = mongoose.model<Interaction>(
  "interactions",
  interactionSchema,
  "interactions"
);
