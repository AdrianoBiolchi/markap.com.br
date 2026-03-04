import { create } from 'zustand';
import api from '../api';

export const useBusinessStore = create((set) => ({
    profile: null,
    isLoading: false,
    error: null,

    fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get('/business-profile');
            set({ profile: res.data, isLoading: false });
        } catch (err) {
            set({ error: 'Erro ao carregar perfil do negócio', isLoading: false });
        }
    },

    updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post('/business-profile', profileData);
            set({ profile: res.data, isLoading: false });
            return true;
        } catch (err) {
            set({ error: 'Erro ao salvar perfil do negócio', isLoading: false });
            return false;
        }
    },
}));
