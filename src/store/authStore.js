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
      // Após registrar, pode fazer login automaticamente se desejar,
      // ou apenas retornar sucesso.
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
    set({ user: null, isAuthenticated: false });
  },

  // Simula buscar dados do usuário logado se o token existir (ex: ao recarregar a página)
  // Requer uma rota GET /auth/me no backend (a ser adicionada se necessário)
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }
    // Para simplificar, poderíamos decodificar o JWT no front ou buscar na API.
    // O mais seguro é ter uma rota de perfil.
  }
}));
