import { create } from 'zustand';
import { api } from '../services/api';

export const useSessionStore = create((set) => ({
  currentSession: null,
  sessionResults: null,
  isLoading: false,
  error: null,

  startSession: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/sessions/start', data);
      set({ currentSession: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Erro ao iniciar sessão', isLoading: false });
      throw error;
    }
  },

  updateDuring: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await api.post(`/sessions/${id}/during`, data);
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Erro ao atualizar sessão', isLoading: false });
      throw error;
    }
  },

  finishSession: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/sessions/${id}/finish`, data);
      set({ sessionResults: response.data, currentSession: null, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Erro ao finalizar sessão', isLoading: false });
      throw error;
    }
  },

  fetchSessionResults: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/sessions/${id}/results`);
      set({ sessionResults: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Erro ao buscar resultados', isLoading: false });
      throw error;
    }
  },
  
  clearSession: () => set({ currentSession: null, sessionResults: null, error: null })
}));
