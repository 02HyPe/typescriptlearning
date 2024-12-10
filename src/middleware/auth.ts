import { JwtPayload, verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "./error/async_handler";

export interface AccessToken extends Request {
  userName: string;
}

export const auth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      res.json({ msg: "sign in needed" });
      return;
    }
    const token = authHeader.split(` `)[1];
    const decodedToken = verify(token, "supersecretkey") as JwtPayload;
    (req as AccessToken).userName = decodedToken.userName;

    next();
  }
);
