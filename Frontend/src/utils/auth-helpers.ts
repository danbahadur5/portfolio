const AUTH_STORAGE_KEY = "cms_auth";

interface AuthData {
  token: string | null;
  refreshToken: string | null;
  csrfToken: string | null;
  isLoggedIn: boolean;
}

export const getAuthData = (): AuthData => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading auth data:", error);
  }
  return {
    token: null,
    refreshToken: null,
    csrfToken: null,
    isLoggedIn: false,
  };
};

export const setAuthData = (token: string, refreshToken: string, csrfToken: string): void => {
  try {
    const authData: AuthData = {
      token,
      refreshToken,
      csrfToken,
      isLoggedIn: true,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
  } catch (error) {
    console.error("Error saving auth data:", error);
  }
};

export const clearAuthData = (): void => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing auth data:", error);
  }
};

export const getToken = (): string | null => {
  return getAuthData().token;
};

export const getRefreshToken = (): string | null => {
  return getAuthData().refreshToken;
};

export const getCSRFToken = (): string | null => {
  return getAuthData().csrfToken;
};

export const isAuthenticated = (): boolean => {
  const data = getAuthData();
  return data.isLoggedIn && !!data.token;
};

export const getUserRole = (): string | null => {
  try {
    const token = getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role || null;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }
  return null;
};

export const isAdmin = (): boolean => {
  const role = getUserRole();
  return role === "admin" || role === "superadmin";
};

export const isSuperAdmin = (): boolean => {
  return getUserRole() === "superadmin";
};

export const isEditor = (): boolean => {
  const role = getUserRole();
  return role === "admin" || role === "superadmin" || role === "editor";
};

export const logout = (redirectTo: string = "/"): void => {
  clearAuthData();
  window.location.href = redirectTo;
};

export const isTokenExpired = (): boolean => {
  try {
    const token = getToken();
    if (!token) return true;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = payload.exp * 1000;

    return Date.now() >= expiryTime;
  } catch (error) {
    console.error("Error checking token expiry:", error);
    return true;
  }
};
