import axios from 'axios';
import { toast } from 'react-hot-toast';
import { clearAuth, getHashRouteUrl, getToken } from '../hooks/useAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_URL || '/api/auth';
export const BACKEND_ORIGIN = (import.meta.env.VITE_BACKEND_ORIGIN || 'http://localhost:8081').replace(/\/$/, '');
const authApi = axios.create({
  baseURL: AUTH_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

const TOAST_DEDUP_WINDOW_MS = 1500;

let lastToastMessage = '';
let lastToastAt = 0;

const normalizeApiPath = (path = '') => {
  if (!path) return '/';

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const trimmedPath = path.startsWith('/') ? path : `/${path}`;
  return trimmedPath.startsWith('/api/') ? trimmedPath.slice(4) : trimmedPath;
};

export const resolveBackendUrl = (path = '') => {
  if (!path) return BACKEND_ORIGIN;
  if (/^https?:\/\//i.test(path)) return path;
  return `${BACKEND_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

const getApiErrorMessage = (error) => {
  const status = error.response?.status;
  const data = error.response?.data;
  const contentType = error.response?.headers?.['content-type'] || '';
  const rawMessage = data?.message || data?.error || error.message;

  if (!error.response) {
    return 'Backend server is not reachable. Start the Spring Boot app on http://localhost:8081 and try again.';
  }

  if (
    status === 500 &&
    typeof rawMessage === 'string' &&
    /proxy error|socket hang up|econnrefused|unable to connect/i.test(rawMessage)
  ) {
    return 'Frontend is running, but the backend server is unavailable. Start the Spring Boot app on port 8081.';
  }

  if (
    status === 500 &&
    (contentType.includes('text/html') ||
      (typeof data === 'string' && /<!doctype html>|<html/i.test(data)) ||
      rawMessage === 'Request failed with status code 500')
  ) {
    return 'Frontend is running, but the backend API is unavailable or failed to start. Make sure Spring Boot is running on http://localhost:8081 and MySQL is up.';
  }

  return rawMessage || 'Unexpected error';
};

const showErrorToast = (message) => {
  const now = Date.now();
  if (message === lastToastMessage && now - lastToastAt < TOAST_DEDUP_WINDOW_MS) {
    return;
  }

  lastToastMessage = message;
  lastToastAt = now;
  toast.error(message, { duration: 4000 });
};

const applyAuthHeader = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

authApi.interceptors.request.use(applyAuthHeader);
api.interceptors.request.use((config) => {
  return applyAuthHeader(config);
});

const handleApiError = (error) => {
  const status = error.response?.status;
  const message = getApiErrorMessage(error);

  if (status === 401 || status === 403) {
    clearAuth();
    window.location.href = getHashRouteUrl('/login');
    return Promise.reject(error);
  }

  showErrorToast(message);

  return Promise.reject(error);
};

authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.config?.url?.includes('/login') || error.config?.url?.includes('/register')) {
      return Promise.reject(error);
    }
    return handleApiError(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  handleApiError
);

export const getResources = async (params = {}) => {
  const response = await api.get(normalizeApiPath('/resources'), { params });
  return response.data;
};

export const getAllResources = async () => {
  const response = await api.get(normalizeApiPath('/resources/all'));
  return response.data;
};

export const getResourceById = async (id) => {
  const response = await api.get(normalizeApiPath(`/resources/${id}`));
  return response.data;
};

export const uploadResource = async (payload) => {
  const response = await api.post(normalizeApiPath('/resources/upload'), payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const login = async (creds) => {
  const response = await authApi.post('/login', creds);
  return response.data;
};

export const getBackendHealth = async () => {
  const response = await fetch(resolveBackendUrl('/api/health'), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Backend health check failed with status ${response.status}`);
  }

  return response.json();
};

export const register = async (creds) => {
  const response = await authApi.post('/register', creds);
  return response.data;
};

export const getCurrentUser = async () => authApi.get('/me').then((response) => response.data);

export const getGoogleAuthStatus = async () => authApi.get('/google/status').then((response) => response.data);

export const getGoogleLoginUrl = () => resolveBackendUrl('/oauth2/authorization/google');

export const getResourceDownloadUrl = (id) => {
  const token = getToken();
  const downloadPath = normalizeApiPath(`/resources/download/${id}`);
  const url = new URL(resolveBackendUrl(`/api${downloadPath}`));
  if (token) {
    url.searchParams.set('token', token);
  }
  return url.toString();
};

export const saveResourceItem = async (id) => {
  const response = await api.post(normalizeApiPath(`/save/${id}`));
  return response.data;
};

export const recordResourceView = async (id) => {
  const response = await api.post(normalizeApiPath(`/view/${id}`));
  return response.data;
};

export const apiFetch = async (path, options = {}) => {
  const response = await api({ url: normalizeApiPath(path), ...options });
  return response.data;
};

export { getApiErrorMessage };
export default api;

