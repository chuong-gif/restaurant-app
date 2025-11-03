import { create } from 'zustand';

type GlobalState = {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
};

export const useGlobalStore = create<GlobalState>((set) => ({
    isLoading: false,
    setIsLoading: (loading) => set({ isLoading: loading }),
}));