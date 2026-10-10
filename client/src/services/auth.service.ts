import { api } from "../api/axios";
import type {
  LoginPayload,
  LoginResponse,
  RefreshResponse,
  RegisterPayload,
  User,
} from "../types/index.js";

interface RegisterResponse {
  success: boolean;
  message: string;
  user: User;
}

interface LogoutResponse {
  success: boolean;
  message: string;
}

export const registerUser = async (
  data: RegisterPayload
) => {
  const response = await api.post<RegisterResponse>(
    "/auth/register",
    data
  );

  return response.data;
};

export const loginUser = async (
  data: LoginPayload
) => {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    data
  );

  return response.data;
};

export const refreshAccessToken = async () => {
  const response = await api.post<RefreshResponse>(
    "/auth/refresh"
  );

  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post<LogoutResponse>(
    "/auth/logout"
  );

  return response.data;
};