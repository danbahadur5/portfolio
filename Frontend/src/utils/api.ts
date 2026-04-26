import axios from 'axios';
import { getToken, getCSRFToken, logout } from './auth-helpers';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const csrfToken = getCSRFToken();
    if (csrfToken) {
      config.headers['x-csrf-token'] = csrfToken;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized, clear session and redirect to login
      logout();
    }
    return Promise.reject(error);
  }
);

export default api;
