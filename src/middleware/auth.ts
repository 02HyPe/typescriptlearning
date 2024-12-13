import { TokenExpiredError, JwtPayload, verify, decode } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "./error/async_handler";
import { ErrorResponse } from "./error/error_handler";
import { access } from "fs";

export interface AccessToken extends Request {
  userName: string;
}

export const auth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // const authHeader = req.headers["authorization"];
    // if (!authHeader) {
    //   throw next(new ErrorResponse(401, "sign in needed"));
    // }
    const { accessToken } = req.cookies;
    if (!accessToken) {
      throw next(new ErrorResponse(401, "sign in needed"));
    }
    console.log(accessToken);
    const token = accessToken.split(` `)[1];
    const verifiedToken = verify(
      token,
      process.env.ACCESS_TOKEN_SECERET
    ) as JwtPayload;
    (req as AccessToken).userName = verifiedToken.userName;

    next();
  }
);
