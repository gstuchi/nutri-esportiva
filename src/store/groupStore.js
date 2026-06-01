import { create } from 'zustand';
import { api } from '../services/api';

export const useGroupStore = create((set) => ({
  groups: [],
  currentGroupAthletes: [],
  isLoading: false,
  error: null,

  fetchCoachGroups: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/groups/coach');
      set({ groups: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Erro ao buscar grupos', isLoading: false });
    }
  },

  createGroup: async (name, description) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/groups', { name, description });
      set((state) => ({ 
        groups: [...state.groups, response.data],
        isLoading: false 
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Erro ao criar grupo', isLoading: false });
      throw error;
    }
  },

  joinGroup: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/groups/join', { code });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Erro ao entrar no grupo', isLoading: false });
      throw error;
    }
  },

  fetchGroupAthletes: async (groupId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/groups/${groupId}/athletes`);
      set({ currentGroupAthletes: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Erro ao buscar atletas', isLoading: false });
    }
  }
}));
