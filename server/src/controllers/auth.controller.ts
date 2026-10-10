import type { Request, Response } from "express";
import type { RegisterInput, LoginInput } from "../schemas/auth.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from "../services/auth.service.js";
import { ApiError } from "../lib/ApiError.js";

export const register = asyncHandler(
  async (
    req: Request<{}, {}, RegisterInput>, // this tells ts that the request body will be of type RegisterInput
    res: Response,
  ) => {
    const user = await registerUser(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  },
);

export const login = asyncHandler(
  async (req: Request<{}, {}, LoginInput>, res: Response) => {
    const result = await loginUser(req.body);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: result.user,
      accessToken: result.accessToken,
    });
  },
);

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  const result = await refreshAccessToken(refreshToken);

  return res.status(200).json({
    success: true,
    accessToken: result.accessToken,
    user: result.user,
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  await logoutUser(refreshToken);

  res.clearCookie("refreshToken");

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const getMe = (req: Request, res: Response) => {
  return res.json({
    success: true,
    userId: req.user?.userId,
  });
};
