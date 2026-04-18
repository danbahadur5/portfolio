import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isAuthenticated, login, logout, UserRole } from './auth';

describe('Auth Utility', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should return false when not logged in', () => {
    expect(isAuthenticated()).toBe(false);
  });

  it('should return true after login', () => {
    login('fake-token', UserRole.ADMIN);
    expect(isAuthenticated()).toBe(true);
  });

  it('should return false after logout', () => {
    login('fake-token', UserRole.ADMIN);
    logout();
    // Note: logout redirects to /login in the implementation
    expect(isAuthenticated()).toBe(false);
  });

  it('should store the token and role correctly', () => {
    login('test-token', UserRole.ADMIN);
    expect(localStorage.getItem('auth_token')).toBe('test-token');
    expect(localStorage.getItem('auth_role')).toBe(UserRole.ADMIN);
  });
});
