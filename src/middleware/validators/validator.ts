import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../error/async_handler";

export const validateData = (schema: z.ZodObject<any, any>) => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      schema.parse(req.body);
      next();
    }
  );
};
