import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../lib/ApiError.js";

interface JwtPayload {
  userId: string;
}

export const verifyJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new ApiError(401, "Access token required"));
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return next(new ApiError(401, "Invalid authorization header"));
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET!
    ) as JwtPayload;

    req.user = {
      userId: payload.userId,
    };

    next();
  } catch {
    return next(new ApiError(401, "Invalid or expired access token"));
  }
};