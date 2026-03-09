import { create } from 'zustand';

import { onAuthChange, getUserProfile, } from '../services/firebase';














export const useUserStore = create((set) => ({
    user: null,
    profile: null,
    loading: true,
    error: null,

    setUser: (user) => set({ user }),
    setProfile: (profile) => set({ profile }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    initialize: () => {
        const unsubscribe = onAuthChange(async (user) => {
            set({ user, loading: false });
            if (user) {
                try {
                    const profile = await getUserProfile(user.uid);
                    set({ profile });
                } catch {
                    set({ profile: null });
                }
            } else {
                set({ profile: null });
            }
        });
        return unsubscribe;
    },

    fetchProfile: async (uid) => {
        try {
            const profile = await getUserProfile(uid);
            set({ profile });
        } catch {
            set({ profile: null });
        }
    },
}));
