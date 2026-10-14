import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Also attach token from localStorage if present as fallback
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vitatwin_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
      localStorage.removeItem('vitatwin_token');
      // Only redirect if not already on public route
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
