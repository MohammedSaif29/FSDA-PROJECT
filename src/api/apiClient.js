import axios from 'axios';
import { toast } from 'react-hot-toast';
import { clearAuth } from '../hooks/useAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
export const BACKEND_ORIGIN = (import.meta.env.VITE_BACKEND_ORIGIN || 'http://localhost:8081').replace(/\/$/, '');

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

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const message = data?.message || data?.error || error.message || 'Unexpected error';

    if (status === 401 || status === 403) {
      clearAuth();
      window.location.href = '/#/login';
      return Promise.reject(error);
    }

    toast.error(message, { duration: 4000 });

    return Promise.reject(error);
  }
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
  const response = await api.post(normalizeApiPath('/resources'), payload);
  return response.data;
};

export const login = async (creds) => {
  const response = await api.post(normalizeApiPath('/auth/login'), creds);
  return response.data;
};

export const register = async (creds) => {
  const response = await api.post(normalizeApiPath('/auth/register'), creds);
  return response.data;
};

export const recordResourceDownload = async (id) => {
  const response = await api.post(normalizeApiPath(`/download/${id}`));
  return response.data;
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

export default api;

