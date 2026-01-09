import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Axios instance with interceptors
 */
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor - attach JWT token
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor - handle 401 and refresh token
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const { data } = await axios.post(`${API_URL}/api/auth/refresh`, {
          refreshToken,
        });

        localStorage.setItem('token', data.data.token);
        localStorage.setItem('refreshToken', data.data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Show error toast
    const message = error.response?.data?.error || 'An error occurred';
    toast.error(message);

    return Promise.reject(error);
  }
);

/**
 * Auth API
 */
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
};

/**
 * Streams API
 */
export const streamsAPI = {
  list: (params) => api.get('/streams', { params }),
  get: (id) => api.get(`/streams/${id}`),
  create: (data) => api.post('/streams', data),
  start: (id) => api.post(`/streams/${id}/start`),
  stop: (id) => api.post(`/streams/${id}/stop`),
  getAnalytics: (id) => api.get(`/streams/${id}/analytics`),
  delete: (id) => api.delete(`/streams/${id}`),
};

/**
 * AI API
 */
export const aiAPI = {
  generatePodcast: (data) => api.post('/ai/podcast/generate', data),
  generateIdeas: (data) => api.post('/ai/content/ideas', data),
  optimizeContent: (data) => api.post('/ai/content/optimize', data),
  chat: (data) => api.post('/ai/chat', data),
  getUsage: () => api.get('/ai/usage'),
};

/**
 * Users API
 */
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getOAuthConnections: () => api.get('/users/oauth-connections'),
};

/**
 * Content API
 */
export const contentAPI = {
  list: (params) => api.get('/content', { params }),
  create: (data) => api.post('/content', data),
  delete: (id) => api.delete(`/content/${id}`),
};

/**
 * Monetization API
 */
export const monetizationAPI = {
  getSubscription: () => api.get('/monetization/subscription'),
  createCheckout: (plan) => api.post('/monetization/create-checkout', { plan }),
  cancelSubscription: () => api.post('/monetization/cancel-subscription'),
};

export default api;
