import { userModel } from "../config/mongoose.model";
import { Request, Response } from "express";
import { User } from "../models/user";
import { genSalt, hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { asyncHandler } from "../middleware/error/async_handler";

export const signUp = asyncHandler(
  async (
    req: Request<{}, {}, { userName: string; email: string; password: string }>,
    res: Response
  ) => {
    const { userName, email, password } = req.body;

    const user = await userModel.findOne({
      $or: [{ userName: userName }, { email: email }],
    });
    if (user) {
      res.json({ msg: "user already registered" });
      return;
    }
    const salt = await genSalt(10);
    console.log(salt, password);
    const hashedPassword = await hash(password, salt);
    const userInfo = new userModel<User>({
      userName: userName,
      email: email,
      password: hashedPassword,
    });
    await userInfo.save();
    res.json(userInfo);
  }
);

export const signIn = asyncHandler(
  async (
    req: Request<{}, {}, { userName: string; password: string }>,
    res: Response
  ) => {
    const { userName, password } = req.body;

    const user = await userModel.findOne({ userName: userName });
    if (!user) {
      res.json({ msg: "no user" });
      return;
    }
    const doMatch = await compare(password, user["password"]);
    if (!doMatch) {
      res.json({ msg: "credential invalid" });
      return;
    }

    const token = sign(
      {
        userName: user["userName"],
        email: user["email"],
      },
      process.env.JWTKEY
    );

    res.json({ user, token: `Bearer ${token}` });
  }
);
