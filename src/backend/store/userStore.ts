import { create } from 'zustand';
import { type User } from 'firebase/auth';
import { onAuthChange, getUserProfile, type UserProfile } from '../services/firebase';

interface UserState {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    setUser: (user: User | null) => void;
    setProfile: (profile: UserProfile | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    initialize: () => () => void;
    fetchProfile: (uid: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
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

    fetchProfile: async (uid: string) => {
        try {
            const profile = await getUserProfile(uid);
            set({ profile });
        } catch {
            set({ profile: null });
        }
    },
}));
