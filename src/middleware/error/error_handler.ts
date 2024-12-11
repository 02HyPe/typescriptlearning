import { Request, Response, ErrorRequestHandler, NextFunction } from "express";
import { isHttpError } from "http-errors";

class ErrorResponse extends Error {
  message: string;
  statusCode: number;
}

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let errorMessage = "unkown error occured";
  if (isHttpError(err)) {
    statusCode = err.status;
    errorMessage = err.message;
  }
  res.status(statusCode).json({
    error: {
      message: errorMessage,
    },
  });
};

export const notFoundError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({
    status: 404 + ` not found`,
    message: `cant find ${req.originalUrl} on the server`,
  });
};
