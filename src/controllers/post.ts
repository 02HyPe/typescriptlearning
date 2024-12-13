import { AccessToken } from "middleware/auth";
import { interactionModel, postModel } from "../config/mongoose.model";
import { userModel } from "../config/mongoose.model";
import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middleware/error/async_handler";
import { User } from "models/user";
import { postType } from "../Schema/postSchema";
import { ErrorResponse } from "../middleware/error/error_handler";
import mongoose from "mongoose";

interface TGetPost {
  [userid: string]: string;
}

export const addPost = asyncHandler(
  async (req: Request<{}, {}, postType>, res: Response, next: NextFunction) => {
    const userName = (req as AccessToken).userName;
    const { title, content } = req.body;

    const user = await userModel.findOne({ userName: userName });
    if (!user) {
      throw next(new ErrorResponse(404, "user not found"));
    }
    const existed = await postModel.findOne({ user: user._id, title: title });
    if (existed) {
      throw next(new ErrorResponse(409, "post already exists"));
    }

    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const postInfo = new postModel({
        user: user["_id"].toString(),
        title: title,
        content: content,
      });
      await postInfo.save({ session });
      const postID = await postModel
        .findOne({
          user: user["_id"].toString(),
          title: title,
        })
        .session(session);
      const postInfoInteraction = new interactionModel({
        user: user["_id"].toString(),
        post: postID?._id,
        likes: [],
      });
      await postInfoInteraction.save({ session });
    });
    await session.endSession();

    res.json({ msg: "Post uploaded" });
  }
);

export const deletePost = asyncHandler(
  async (req: Request<{}, {}, postType>, res: Response, next: NextFunction) => {
    const { title } = req.body;
    const userName = (req as AccessToken).userName;
    console.log(title, userName);
    const post = await postModel.findOne({ title: title });
    const user = await userModel.findOne({ userName: userName });
    if (!post || !user) {
      throw next(new ErrorResponse(404, "user or post not found"));
    }
    if (post.user?.toString() !== user._id.toString()) {
      throw next(new ErrorResponse(401, "invalid post or not your post"));
    }
    await postModel.findByIdAndDelete(post?._id);
    res.json({ msg: "deleted successfully" });
  }
);
export const updatePost = asyncHandler(
  async (req: Request<{}, {}, postType>, res: Response, next: NextFunction) => {
    const { title, content } = req.body;
    const userName = (req as AccessToken).userName;
    const user = await userModel.findOne({ userName: userName });
    const post = await postModel.findOne({ title: title, user: user?._id });
    if (!post || !user) {
      throw next(new ErrorResponse(404, "user or post not found"));
    }
    if (post.user !== user._id) {
      throw next(new ErrorResponse(401, "invalid post or not your post"));
    }
    await postModel.findOneAndUpdate(
      { _id: post?._id },
      {
        title: title,
        content: content,
        $inc: { __v: 1 },
      }
    );
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
  async (
    req: Request<{}, {}, {}, { postid?: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const { postid } = req.query;
    if (!postid) {
      throw next(new ErrorResponse(400, "invalid query or params "));
    }
    // const _id = new mongoose.Types.ObjectId(postid.toString());
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

//1 user = 1 like remaing
export const addLike = asyncHandler(
  async (
    req: Request<{}, {}, { title: string; user: string; userName: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const { title, user } = req.body;
    const postUser = await userModel.findOne({ userName: user });
    if (!postUser) {
      throw next(new ErrorResponse(404, "postUser not found"));
    }
    const post = await postModel.findOne({
      title: title,
      user: postUser?._id,
    });
    if (!post) {
      throw next(new ErrorResponse(404, "post not found"));
    }

    const validateLike = await interactionModel.findOne({
      user: postUser?._id,
      post: post?._id,
    });
    if (!validateLike) {
      throw next(new ErrorResponse(404, "validateLike not found"));
    }
    const likeUser = await userModel.findOne({
      userName: (req as AccessToken).userName,
    });
    if (!likeUser) {
      throw next(new ErrorResponse(404, "likeUser not found"));
    }

    const likeuserId: string = likeUser?._id.toString();
    if (validateLike?.likes?.includes(likeuserId)) {
      res.status(200).json({ msg: "liked" });
      return;
    }

    await interactionModel.findOneAndUpdate(
      {
        user: postUser?._id,
        post: post?._id,
      },
      {
        $push: {
          likes: likeUser?._id,
        },
        $inc: {
          __v: 1,
        },
      }
    );

    res.json({ msg: "successfull" });
  }
);

export const addViews = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, postUserName } = req.body;
    const postUser = await userModel.findOne({ userName: postUserName });
    if (!postUser) {
      throw next(new ErrorResponse(404, "post user not found to view"));
    }
    const post = await postModel.findOne({
      user: postUser._id,
      title: title,
    });
    if (!post) {
      throw next(new ErrorResponse(404, "post not found to view"));
    }
    await interactionModel.findOneAndUpdate(
      {
        user: postUser._id,
        post: post._id,
      },
      {
        $inc: { views: 1 },
      }
    );
    res.json({ msg: "viewed" });
  }
);
