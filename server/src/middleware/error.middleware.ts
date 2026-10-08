import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../lib/ApiError.js";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  if (err instanceof ApiError) {
    console.error('from error handler' +''+ err.message, err.details);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });
  }

  return res.status(500).json({
    success: false,
    message: err || "Internal server error",
  });
};
