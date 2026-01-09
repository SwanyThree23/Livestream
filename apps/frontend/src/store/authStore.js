import { create } from 'zustand';
import { authAPI } from '../lib/api';
import toast from 'react-hot-toast';

/**
 * Auth Store - Manages user authentication state
 */
export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    const { token } = get();
    return !!token;
  },

  /**
   * Register new user
   */
  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.register(data);
      const { user, token, refreshToken } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      set({ user, token, loading: false });
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.error });
      return false;
    }
  },

  /**
   * Login user
   */
  login: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.login(data);
      const { user, token, refreshToken } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      set({ user, token, loading: false });
      toast.success('Login successful!');
      return true;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.error });
      return false;
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      set({ user: null, token: null });
      toast.success('Logged out successfully');
    }
  },

  /**
   * Fetch current user
   */
  fetchUser: async () => {
    const { token } = get();
    if (!token) return;

    set({ loading: true });
    try {
      const response = await authAPI.getMe();
      set({ user: response.data.data.user, loading: false });
    } catch (error) {
      set({ loading: false });
      // Token might be invalid, clear it
      if (error.response?.status === 401) {
        get().logout();
      }
    }
  },
}));

// Auto-fetch user on mount if token exists
if (localStorage.getItem('token')) {
  useAuthStore.getState().fetchUser();
}
