import { userModel, sessionModel } from "../config/mongoose.model";
import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { Session } from "../models/session";
import { genSalt, hash, compare } from "bcrypt";
import mongoose from "mongoose";
import { asyncHandler } from "../middleware/error/async_handler";
import { signInType, signUpType } from "../Schema/userSchema";
import { ErrorResponse } from "../middleware/error/error_handler";
import {
  AccessAndRefreshTokenGenerator,
  accessTokenGenerator,
} from "../utils/tokenGenerator";
import { decode, JwtPayload } from "jsonwebtoken";

export const signUp = asyncHandler(
  async (
    req: Request<{}, {}, signUpType>,
    res: Response,
    next: NextFunction
  ) => {
    const { userName, email, password } = req.body;
    let accessToken;
    let refreshToken;
    const user = await userModel.findOne({
      $or: [{ userName: userName }, { email: email }],
    });
    if (user) {
      throw next(new ErrorResponse(401, "user already registered"));
    }
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    // await session.withTransaction(async () => {});

    const session = await userModel.startSession();
    await session.withTransaction(async () => {
      const userInfo = new userModel<User>({
        userName: userName,
        email: email,
        password: hashedPassword,
      });
      const userCreated = await userInfo.save({ session });
      if (!userCreated) {
        throw next(new ErrorResponse(404, "failed to create user"));
      }
      const tokens = AccessAndRefreshTokenGenerator(
        userCreated.userName,
        userCreated.email
      );
      accessToken = tokens.accessToken;
      refreshToken = tokens.refreshToken;
      const sessionInfo = new sessionModel<Session>({
        user: userCreated._id,
        refreshToken: tokens.refreshToken,
      });

      await sessionInfo.save({ session });
    });
    await session.endSession();
    res
      .cookie("accessToken", `Bearer ${accessToken}`)
      .cookie("refreshToken", `Bearer ${refreshToken}`)
      .json({ msg: "user added" });
  }
);

export const signIn = asyncHandler(
  async (
    req: Request<{}, {}, signInType>,
    res: Response,
    next: NextFunction
  ) => {
    const { userName, password } = req.body;
    let accessToken;
    let refreshToken;
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const user = await userModel.findOne({ userName: userName });
      if (!user) {
        throw next(new ErrorResponse(404, " no user"));
      }
      const doMatch = await compare(password, user["password"]);
      if (!doMatch) {
        throw next(new ErrorResponse(501, "invalid credential"));
      }

      const tokens = AccessAndRefreshTokenGenerator(user.userName, user.email);
      accessToken = tokens.accessToken;
      refreshToken = tokens.refreshToken;

      const sessionInfo = new sessionModel<Session>({
        user: user._id,
        refreshToken: tokens.refreshToken,
      });

      await sessionInfo.save({ session });
    });
    await session.endSession();

    res
      .cookie("accessToken", `Bearer ${accessToken}`)
      .cookie("refreshToken", `Bearer ${refreshToken}`)
      .json({
        token: `Bearer ${accessToken} and  ${refreshToken}`,
      });
  }
);

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies;
    console.log(refreshToken);
    const token = refreshToken.split(` `)[1];
    const valid = await sessionModel.findOne({ refreshToken: token });
    if (!valid) {
      throw next(new ErrorResponse(401, "Login expired"));
    }
    const { userName, email } = decode(token) as JwtPayload;
    const newAccessToken = accessTokenGenerator(userName, email);
    res
      .cookie("accessToken", `Bearer ${newAccessToken}`)
      .json({ msg: "token refreshed succcessfully" });
  }
);
