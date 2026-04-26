import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from "react";
import { User, AuthState, LoginCredentials, RegisterData, MFACredentials } from "../types/cms";
import api from "../utils/api";
import { getToken, setAuthData, clearAuthData, getRefreshToken, getCSRFToken } from "../utils/auth-helpers";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  verifyMFA: (credentials: MFACredentials) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshToken: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  enableMFA: () => Promise<{ secret: string; backupCodes: string[] }>;
  disableMFA: (password: string, code: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  fetchUser: () => Promise<void>;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (...roles: string[]) => boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  csrfToken: null,
  isAuthenticated: false,
  mfaRequired: false,
};

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User | null; token: string; refreshToken: string; csrfToken: string } }
  | { type: "MFA_REQUIRED"; payload: { tempToken: string } }
  | { type: "MFA_VERIFIED"; payload: { user: User; token: string; refreshToken: string; csrfToken: string } }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "REFRESH_TOKEN_SUCCESS"; payload: { token: string; csrfToken: string } }
  | { type: "SET_CSRF"; payload: string };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state };
    case "LOGIN_SUCCESS":
    case "MFA_VERIFIED":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        csrfToken: action.payload.csrfToken,
        isAuthenticated: true,
        mfaRequired: false,
        tempToken: undefined,
      };
    case "MFA_REQUIRED":
      return {
        ...state,
        mfaRequired: true,
        tempToken: action.payload.tempToken,
      };
    case "LOGIN_FAILURE":
      return {
        ...initialState,
      };
    case "LOGOUT":
      return {
        ...initialState,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "REFRESH_TOKEN_SUCCESS":
      return {
        ...state,
        token: action.payload.token,
        csrfToken: action.payload.csrfToken,
      };
    case "SET_CSRF":
      return {
        ...state,
        csrfToken: action.payload,
      };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const fetchUser = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await api.get("/api/profile");
      if (response.data.success) {
        dispatch({ type: "UPDATE_USER", payload: response.data.user });
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      if (error.response?.status === 401) {
        clearAuthData();
        dispatch({ type: "LOGOUT" });
      }
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const refresh = getRefreshToken();
      if (!refresh) {
        throw new Error("No refresh token");
      }

      const response = await api.post("/api/auth/refresh-token", { refreshToken: refresh });
      if (response.data.success) {
        dispatch({
          type: "REFRESH_TOKEN_SUCCESS",
          payload: {
            token: response.data.accessToken,
            csrfToken: response.data.csrfToken,
          },
        });
        setAuthData(response.data.accessToken, getRefreshToken() || "", response.data.csrfToken);
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      clearAuthData();
      dispatch({ type: "LOGOUT" });
      window.location.href = "/";
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await api.post("/api/auth/login", credentials);

      if (response.data.mfaRequired) {
        dispatch({
          type: "MFA_REQUIRED",
          payload: { tempToken: response.data.tempToken },
        });
        return;
      }

      if (response.data.success) {
        const { user, accessToken, refreshToken: rfToken, csrfToken } = response.data;
        setAuthData(accessToken, rfToken, csrfToken);
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, token: accessToken, refreshToken: rfToken, csrfToken },
        });
      }
    } catch (error: any) {
      dispatch({ type: "LOGIN_FAILURE" });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await api.post("/api/auth/register", data);

      if (response.data.success) {
        const { user, accessToken, refreshToken: rfToken, csrfToken } = response.data;
        setAuthData(accessToken, rfToken, csrfToken);
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, token: accessToken, refreshToken: rfToken, csrfToken },
        });
      }
    } catch (error: any) {
      dispatch({ type: "LOGIN_FAILURE" });
      throw error;
    }
  };

  const verifyMFA = async (credentials: MFACredentials) => {
    try {
      const response = await api.post("/api/auth/verify-mfa", credentials);

      if (response.data.success) {
        const { user, accessToken, refreshToken: rfToken, csrfToken } = response.data;
        setAuthData(accessToken, rfToken, csrfToken);
        dispatch({
          type: "MFA_VERIFIED",
          payload: { user, token: accessToken, refreshToken: rfToken, csrfToken },
        });
      }
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.get("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuthData();
      dispatch({ type: "LOGOUT" });
      window.location.href = "/";
    }
  };

  const logoutAll = async () => {
    try {
      await api.post("/api/auth/logout-all");
    } catch (error) {
      console.error("Logout all error:", error);
    } finally {
      clearAuthData();
      dispatch({ type: "LOGOUT" });
      window.location.href = "/";
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    const csrfToken = getCSRFToken();
    const response = await api.post(
      "/api/auth/change-password",
      { currentPassword, newPassword },
      { headers: { "x-csrf-token": csrfToken } }
    );
    return response.data;
  };

  const enableMFA = async () => {
    const response = await api.get("/api/auth/mfa/enable");
    return {
      secret: response.data.mfaSecret,
      backupCodes: response.data.backupCodes,
    };
  };

  const disableMFA = async (password: string, code: string) => {
    const csrfToken = getCSRFToken();
    const response = await api.post(
      "/api/auth/mfa/disable",
      { password, code },
      { headers: { "x-csrf-token": csrfToken } }
    );
    return response.data;
  };

  const updateProfile = async (data: Partial<User>) => {
    const csrfToken = getCSRFToken();
    const response = await api.put(
      "/api/profile",
      data,
      { headers: { "x-csrf-token": csrfToken } }
    );
    if (response.data.success) {
      dispatch({ type: "UPDATE_USER", payload: response.data.user });
    }
    return response.data;
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!state.user) return false;
    const { role } = state.user;

    // Superadmin and Admin have all permissions
    if (role === "superadmin" || role === "admin") return true;

    // Editor permissions
    if (role === "editor") {
      const allowedActions = ["view", "edit", "create"];
      const restrictedResources = ["users", "settings", "analytics"];
      
      if (restrictedResources.includes(resource)) {
        return false;
      }
      
      return allowedActions.includes(action);
    }

    return false;
  };

  const hasRole = (...roles: string[]): boolean => {
    if (!state.user) return false;
    return roles.includes(state.user.role);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      const rfToken = getRefreshToken();

      if (token && rfToken) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: null,
            token,
            refreshToken: rfToken,
            csrfToken: getCSRFToken() || "",
          },
        });
        await fetchUser();
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (state.token) {
      try {
        const parts = state.token.split(".");
        if (parts.length !== 3) throw new Error("Invalid token format");
        
        const tokenData = JSON.parse(atob(parts[1]));
        const expiryTime = tokenData.exp * 1000;
        const bufferTime = 5 * 60 * 1000;
        const timeUntilExpiry = expiryTime - Date.now();

        if (timeUntilExpiry < bufferTime) {
          refreshToken();
        }

        const timeoutId = setTimeout(() => {
          refreshToken();
        }, Math.max(0, timeUntilExpiry - bufferTime));

        return () => clearTimeout(timeoutId);
      } catch (error) {
        console.error("Token decoding failed:", error);
        clearAuthData();
        dispatch({ type: "LOGOUT" });
      }
    }
  }, [state.token, refreshToken]);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    verifyMFA,
    logout,
    logoutAll,
    refreshToken,
    changePassword,
    enableMFA,
    disableMFA,
    updateProfile,
    fetchUser,
    hasPermission,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
