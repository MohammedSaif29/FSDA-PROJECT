import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
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

    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/#/login';
    }

    toast.error(message, { duration: 4000 });

    return Promise.reject(error);
  }
);

export const getResources = async (params = {}) => {
  const response = await api.get('/resources', { params });
  return response.data;
};

export const getResourceById = async (id) => {
  const response = await api.get(`/resources/${id}`);
  return response.data;
};

export const uploadResource = async (payload) => {
  const response = await api.post('/resources', payload);
  return response.data;
};

export const login = async (creds) => {
  const response = await api.post('/auth/login', creds);
  return response.data;
};

export const register = async (creds) => {
  const response = await api.post('/auth/register', creds);
  return response.data;
};

export const apiFetch = async (path, options = {}) => {
  const response = await api({ url: path, ...options });
  return response.data;
};

export default api;

