import { Request, Response, ErrorRequestHandler, NextFunction } from "express";
import { isHttpError } from "http-errors";

export class ErrorResponse extends Error {
  constructor(private statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  error = new ErrorResponse(error.statusCode, error.message);
  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      code: error.statusCode || 500,
      message: error.message || "Server Error",
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
