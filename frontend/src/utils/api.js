import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add simple cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCached = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCached = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

export const menuApi = {
  getAllItems: async () => {
    const cached = getCached('menu-items');
    if (cached) return cached;

    const response = await api.get('/menu');
    setCached('menu-items', response);
    return response;
  },
  createItem: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    return api.post('/menu', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateItem: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    return api.put(`/menu/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteItem: (id) => api.delete(`/menu/${id}`),
};

export const orderApi = {
  getAllOrders: () => api.get('/orders'),
  createOrder: (data) => api.post('/orders', data),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  assignWaiter: (id, waiterId) => api.put(`/orders/${id}/assign`, { waiterId }),
};

export const waiterApi = {
  getAllWaiters: () => api.get('/waiters'),
  createWaiter: (data) => api.post('/waiters', data),
  updateWaiter: (id, data) => api.put(`/waiters/${id}`, data),
  deleteWaiter: (id) => api.delete(`/waiters/${id}`),
  updateStatus: (id, status) => api.put(`/waiters/${id}/status`, { status }),
};

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export default api; 