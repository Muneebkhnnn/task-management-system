import bcrypt from "bcrypt";
import { prisma } from "../lib/db.js";
import { ApiError } from "../lib/ApiError.js";
import type { RegisterInput, LoginInput } from "../schemas/auth.schema.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";

export const registerUser = async (data: RegisterInput) => {
  const { username, email, password } = data;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
    },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
};

export const loginUser = async (data: LoginInput) => {
  const { identifier, password } = data;

  console.log("Login started for identifier:", identifier);
  
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user.id);

  const refreshToken = generateRefreshToken(user.id);

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const rdata=await prisma.refreshToken.create({
    data: {
      tokenHash: refreshTokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('data frm refresh table',rdata);

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken: string | undefined) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token required");
  }

  let payload: { userId: string };

  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as {
      userId: string;
    };
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      tokenHash: refreshTokenHash,
    },
  });

  if (!storedToken) {
    throw new ApiError(401, "Refresh token not found");
  }

  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({
      where: {
        id: storedToken.id,
      },
    });

    throw new ApiError(401, "Refresh token expired");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  const accessToken = generateAccessToken(user.id);

  return {
    accessToken,
    user,
  };
};

export const logoutUser = async (refreshToken: string | undefined) => {
  if (!refreshToken) {
    throw new ApiError(400, "Refresh token not found");
  }

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await prisma.refreshToken.deleteMany({
    where: {
      tokenHash: refreshTokenHash,
    },
  });
};
