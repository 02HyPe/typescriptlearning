import { AccessToken } from "middleware/auth";
import { postModel } from "../config/mongoose.model";
import { userModel } from "../config/mongoose.model";
import { Request, Response } from "express";
import { asyncHandler } from "../middleware/error/async_handler";
import { ParsedQs } from "qs";
import mongoose from "mongoose";
import { User } from "models/user";
import { postType } from "../Schema/postSchema";

interface TGetPost {
  [userid: string]: string;
}

export const addPost = asyncHandler(
  async (req: Request<{}, {}, postType>, res: Response) => {
    const userName = (req as AccessToken).userName;
    const { title, content } = req.body;

    const user = await userModel.findOne({ userName: userName });
    if (!user) {
      res.json({ msg: "no userfound" });
      return;
    }
    const existed = await postModel.findOne({ user: user._id, title: title });
    if (existed) {
      res.json({ msg: "post with this already exists" });
      return;
    }

    const postInfo = new postModel({
      user: user["_id"].toString(),
      title: title,
      content: content,
    });

    await postInfo.save();

    res.json({ msg: "Post uploaded" });
  }
);

export const deletePost = asyncHandler(
  async (req: Request<{}, {}, postType>, res: Response) => {
    const { title } = req.body;
    const userName = (req as AccessToken).userName;
    console.log(title, userName);
    const post = await postModel.findOne({ title: title });
    const user = await userModel.findOne({ userName: userName });
    if (!post || !user) {
      res.json({ msg: "invalid user or no post" });
      return;
    }
    if (post.user?.toString() !== user._id.toString()) {
      res.json({ msg: "invalid user or not ur post" });
      return;
    }
    await postModel.findByIdAndDelete(post?._id);
    res.json({ msg: "deleted successfully" });
  }
);
export const updatePost = asyncHandler(
  async (req: Request<{}, {}, postType>, res: Response) => {
    const { title, content } = req.body;
    const userName = (req as AccessToken).userName;
    const post = await postModel.findOne({ title: title });
    const user = await userModel.findOne({ userName: userName });
    if (!post || !user) {
      res.json({ msg: "invalid user or no post" });
      return;
    }
    if (post.user !== user._id) {
      res.json({ msg: "invalid user or not ur post" });
      return;
    }
    const updatedPost = await postModel.findByIdAndUpdate(post?._id, {
      title: title,
      content: content,
    });
    console.log(`post updated ${updatedPost}`);
    res.json({ msg: "post successfully updated" });
  }
);

export const allPost = asyncHandler(async (req: Request, res: Response) => {
  const posts = await postModel.find().populate<{ user: User }>("user");
  if (!posts[0]) {
    res.json({ msg: "empty" });
    return;
  }
  console.log(posts);
  res.json(posts);
});
// /posts/:id

export const userPost = asyncHandler(
  async (req: Request<TGetPost>, res: Response) => {
    const { userid } = req.params;
    console.log(userid);
    const post = await postModel
      .find({ user: userid })
      .populate<{ user: User }>("user");
    if (!post[0]) {
      res.json({ msg: "empty" });
      return;
    }
    console.log(post[0].user.userName);
    res.json({ msg: "post by this user", post: post });
  }
);
export const offsetPagePost = asyncHandler(
  async (req: Request<{ [key: string]: string }>, res: Response) => {
    const page = (parseInt(req.params.page) - 1) | 0;
    const postPerPage = 10;
    const skipTo = page * postPerPage;
    const post = await postModel.find().skip(skipTo).limit(postPerPage);
    if (!post[0]) {
      res.json("empty");
      return;
    }
    res.json({ post: post });
  }
);

export const cursorPagePost = asyncHandler(
  async (req: Request<{}, {}, {}, { postid?: string }>, res: Response) => {
    const { postid } = req.query;
    if (!postid) {
      res.json({ msg: "query missing" });
      return;
    }
    const _id = new mongoose.Types.ObjectId(postid.toString());
    const perPage = 10;
    const posts = await postModel
      .find({ _id: { $gte: postid } })
      .limit(perPage);
    if (!posts[0]) {
      res.json("empty");
      return;
    }
    res.json({ post: posts });
  }
);

export const offsetPagePostq = asyncHandler(
  async (
    req: Request<
      {},
      {},
      {},
      {
        page?: string;
        limit?: string;
      }
    >,
    res: Response
  ) => {
    const { page, limit } = req.query;
    const pageno = (page ? parseInt(page) : 1) - 1;
    const limitno = limit ? parseInt(limit) : 10;
    const offset = pageno * limitno;

    const posts = await postModel.find().skip(offset).limit(limitno);
    if (!posts[0]) {
      res.json({ msg: "empty" });
      return;
    }

    res.json(posts);
  }
);
