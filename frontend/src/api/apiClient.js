import axios from 'axios';
import {
  clearAuth,
  getToken,
  isAuthenticated,
} from '../hooks/useAuth';

const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_URL || '/api/auth';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

const authApi = axios.create({
  baseURL: AUTH_API_BASE_URL,
});

const ensureAbsoluteUrl = (value) => {
  if (!value) return value;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/')) return value;
  return `/${value}`;
};

const BACKEND_ORIGIN = (() => {
  const backendOrigin = import.meta.env.VITE_BACKEND_ORIGIN;
  if (backendOrigin && /^https?:\/\//i.test(backendOrigin)) {
    return backendOrigin.replace(/\/$/, '');
  }

  if (API_BASE_URL && /^https?:\/\//i.test(API_BASE_URL)) {
    return API_BASE_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');
  }

  return window.location.origin;
})();

export const resolveBackendUrl = (path) => {
  const normalizedPath = ensureAbsoluteUrl(path) || '/';
  if (normalizedPath.startsWith('http://') || normalizedPath.startsWith('https://')) {
    return normalizedPath;
  }
  return `${BACKEND_ORIGIN}${normalizedPath}`;
};

const attachAuthHeader = (config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(attachAuthHeader);
authApi.interceptors.request.use(attachAuthHeader);

const handleApiError = (error) => {
  const status = error.response?.status;
  if ((status === 401 || status === 403) && isAuthenticated()) {
    clearAuth();
    if (window.location.pathname !== `${import.meta.env.BASE_URL}login`) {
      window.location.href = `${import.meta.env.BASE_URL}login`;
    }
  }
  throw error;
};

api.interceptors.response.use((response) => response, handleApiError);
authApi.interceptors.response.use((response) => response, handleApiError);

export const getApiErrorMessage = (error, fallback = 'Something went wrong') => {
  return error.response?.data?.message || error.response?.data?.error || fallback;
};

export const getResources = async () => {
  const res = await api.get('/resources');
  return Array.isArray(res.data) ? res.data : [];
};

export const getAllResources = async () => {
  const res = await api.get('/admin/resources');
  return Array.isArray(res.data) ? res.data : [];
};

export const getResourceById = async (id) => {
  const res = await api.get(`/resources/${id}`);
  return res.data;
};

export const uploadResource = async (formData) => {
  const res = await api.post('/resources/upload', formData);
  return res.data;
};

export const login = async ({ identifier, password }) => {
  const res = await api.post('/auth/login', { identifier, password });
  return res.data;
};

export const getBackendHealth = async () => {
  const res = await axios.get(resolveBackendUrl('/api/health'));
  return res.data;
};

export const register = async ({ username, email, password }) => {
  const res = await api.post('/auth/register', { username, email, password });
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

export const getGoogleAuthStatus = async () => {
  const res = await api.get('/auth/google/status');
  return res.data;
};

export const getGoogleLoginUrl = () => resolveBackendUrl('/oauth2/authorization/google');

export const getResourceDownloadUrl = (resourceId) => resolveBackendUrl(`/api/resources/download/${resourceId}`);

export const getResourceAvailability = async (resourceId) => {
  const res = await api.get(`/resources/${resourceId}/availability`);
  return res.data;
};

export const saveResourceItem = async (resourceId) => {
  const res = await api.post(`/save/${resourceId}`);
  return res.data;
};

export const recordResourceView = async (resourceId) => {
  const res = await api.post(`/view/${resourceId}`);
  return res.data;
};

export async function apiFetch(input, init = {}) {
  const url = typeof input === 'string' ? resolveBackendUrl(input) : input;
  const headers = new Headers(init.headers || {});
  const token = getToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let body = init.body;
  if (body === undefined && Object.prototype.hasOwnProperty.call(init, 'data')) {
    if (init.data instanceof FormData) {
      body = init.data;
    } else if (init.data !== undefined) {
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
      body = headers.get('Content-Type')?.includes('application/json')
        ? JSON.stringify(init.data)
        : init.data;
    }
  }

  const response = await fetch(url, { ...init, headers, body });
  if (response.status === 401 || response.status === 403) {
    clearAuth();
  }

  const contentType = response.headers.get('content-type') || '';
  let payload = null;

  if (response.status !== 204) {
    if (contentType.includes('application/json')) {
      payload = await response.json();
    } else {
      const text = await response.text();
      payload = text || null;
    }
  }

  if (!response.ok) {
    const error = new Error(
      payload?.message || payload?.error || `Request failed with status ${response.status}`
    );
    error.status = response.status;
    error.response = {
      status: response.status,
      data: payload,
    };
    throw error;
  }

  return payload;
}

export default api;
