import mongoose from "mongoose"
import {User, userSchema} from "../models/user"
import {Post, postSchema} from "../models/post"

export const postModel = mongoose.model <Post>("posts", postSchema, "posts")
export const userModel = mongoose.model <User>("users", userSchema, "users")