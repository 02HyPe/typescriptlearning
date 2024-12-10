import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const asyncHandler = (
  cb: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res.json({ error: "Invalid data", details: errorMessages });
        return;
      }
      console.log(error);
      res.json(`${error}`);
      return;
    }
  };
};
