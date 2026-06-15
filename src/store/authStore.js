import { create } from 'zustand';
import { api } from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('isAuthenticated', 'true');
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });
      return user;
    } catch (error) {
      set({ 
        error: error.response?.data?.error || 'Erro ao fazer login', 
        isLoading: false 
      });
      throw error;
    }
  },

  register: async (name, email, password, role) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/register', { name, email, password, role });
      set({ isLoading: false });

      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.error || 'Erro ao registrar', 
        isLoading: false 
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }
    try {
      const response = await api.get('/auth/me');
      set({ user: response.data.user, isAuthenticated: true });
    } catch {
      localStorage.removeItem('token');
      set({ isAuthenticated: false, user: null });
    }
  }
}));
