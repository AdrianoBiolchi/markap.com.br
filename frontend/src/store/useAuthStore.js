import { create } from 'zustand';
import api from '../api';

export const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuth: !!localStorage.getItem('token'),
    hasCompletedOnboarding: JSON.parse(localStorage.getItem('user'))?.has_completed_onboarding || false,
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post('/auth/login', { email, password });
            const { user, token } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            set({ user, isAuth: true, hasCompletedOnboarding: user.has_completed_onboarding, isLoading: false });
            return true;
        } catch (err) {
            set({ error: err.response?.data?.error || 'Erro ao fazer login', isLoading: false });
            return false;
        }
    },

    register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post('/auth/register', { email, password, name });
            const { user, token } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            set({ user, isAuth: true, hasCompletedOnboarding: false, isLoading: false });
            return true;
        } catch (err) {
            set({ error: err.response?.data?.error || 'Erro ao registrar', isLoading: false });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, isAuth: false, hasCompletedOnboarding: false });
    },

    completeOnboarding: async (answers) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;

        try {
            await api.post('/auth/complete-onboarding', {
                userId: user.id,
                businessType: answers?.type,
                taxRegime: answers?.regime,
                onboardingGoal: answers?.goal
            });
            const updatedUser = {
                ...user,
                has_completed_onboarding: true,
                businessType: answers?.type,
                taxRegime: answers?.regime,
                onboardingGoal: answers?.goal
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            set({ hasCompletedOnboarding: true, user: updatedUser });
        } catch (err) {
            console.error('Error completing onboarding', err);
        }
    },
}));
