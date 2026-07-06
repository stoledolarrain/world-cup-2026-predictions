import api from './api';

export const loginService = async (email, password) => {
  // api.post automáticamente le agrega el "http://localhost:3000/api" si está bien configurado en api.js
  const response = await api.post('/auth/login', { email, password });
  return response.data; 
};

export const registerService = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const logoutService = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const getProfileService = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const updateProfileService = async (userData) => {
  const response = await api.put('/users/profile', userData);
  return response.data;
};

export const getDashboardSummaryService = async () => {
  const response = await api.get('/users/dashboard');
  return response.data;
};