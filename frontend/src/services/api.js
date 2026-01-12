import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  loginTelegram: (telegramId, username, firstName, lastName) =>
    api.post('/auth/telegram', { telegramId, username, firstName, lastName }),

  getMe: () => api.get('/auth/me')
};

// Rangers
export const rangersAPI = {
  getAll: () => api.get('/rangers'),

  getById: (id) => api.get(`/rangers/${id}`),

  buy: (tonTransactionHash, walletAddress) =>
    api.post('/rangers/buy', { tonTransactionHash, walletAddress }),

  upgrade: (id) => api.post(`/rangers/${id}/upgrade`),

  getRarities: () => api.get('/rangers/info/rarities')
};

// Transactions
export const transactionsAPI = {
  getAll: () => api.get('/transactions'),

  claim: (walletAddress) =>
    api.post('/transactions/claim', { walletAddress }),

  getStats: () => api.get('/transactions/stats'),

  getPendingReward: () => api.get('/transactions/pending-reward')
};

export default api;
