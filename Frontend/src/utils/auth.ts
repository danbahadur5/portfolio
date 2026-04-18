/**
 * Authentication utility for managing user sessions securely.
 * Note: In a production environment, it is highly recommended to use HttpOnly cookies
 * for storing tokens to prevent XSS attacks.
 */

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

interface AuthData {
  isLoggedIn: boolean;
  token: string | null;
  role: UserRole | null;
}

const STORAGE_KEYS = {
  IS_LOGGED_IN: 'auth_is_logged_in',
  TOKEN: 'auth_token',
  ROLE: 'auth_role',
} as const;

export const isAuthenticated = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true' && !!getToken();
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch {
    return null;
  }
};

export const getUserRole = (): UserRole | null => {
  try {
    const role = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (role as UserRole) || null;
  } catch {
    return null;
  }
};

export const isAdmin = (): boolean => getUserRole() === UserRole.ADMIN;

export const login = (token: string, role: UserRole): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  } catch (error) {
    console.error('Error during login:', error);
  }
};

export const logout = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    // Redirect to login or home
    window.location.href = '/login';
  } catch (error) {
    console.error('Error during logout:', error);
  }
};
