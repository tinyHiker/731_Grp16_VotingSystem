import axios from 'axios';

const api = axios.create({
  baseURL: '/', // thanks to proxy, /api goes to backend
});

// Attach token automatically if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
