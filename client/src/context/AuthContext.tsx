import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  loginUser as loginRequest,
  registerUser as registerRequest,
  logoutUser as logoutRequest,
  refreshAccessToken,
} from "../services/auth.service";

import {
  clearAccessToken,
  setAccessToken,
} from "../api/token";

import type {
  LoginPayload,
  RegisterPayload,
  User,
} from "../types/index.js";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuth = useCallback(() => {
    clearAccessToken();
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        const response = await refreshAccessToken();

        if (!active) return;

        setAccessToken(response.accessToken);
        setUser(response.user);
      } catch {
        if (active) {
          clearAuth();
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void restoreSession();

    return () => {
      active = false;
    };
  }, [clearAuth]);

  // Responding when the Axios interceptor detects a failed refresh
  useEffect(() => {
    window.addEventListener("auth:logout", clearAuth);

    return () => {
      window.removeEventListener("auth:logout", clearAuth);
    };
  }, [clearAuth]);

  const login = async (data: LoginPayload) => {
    const response = await loginRequest(data);

    setAccessToken(response.accessToken);
    setUser(response.user);
  };

  const register = async (data: RegisterPayload) => {
    await registerRequest(data);
  };

  const logout = async () => {
    try {
      const response = await logoutRequest();

      if (!response.success) {
        throw new Error("Logout failed. Please try again.");
      }

      clearAuth();
    } catch (error: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : undefined;

      toast.error(message ?? "Logout failed. Please try again.");
    }
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
};