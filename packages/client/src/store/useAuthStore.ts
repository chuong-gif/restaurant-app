// packages/client/src/store/useAuthStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User } from '@/types/user';

type AuthState = {
    user: User | null;
    token: string | null;
    setUserToken: (user: User, token: string) => void;
    setUser: (user: User) => void; // <-- THÊM DÒNG NÀY
    logout: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            // Action để set user và token khi đăng nhập
            setUserToken: (user, token) => {
                set({ user, token });
            },
            // === THÊM HÀM MỚI ĐỂ CẬP NHẬT USER ===
            setUser: (user) => {
                set((state) => ({
                    ...state,
                    user: { ...state.user, ...user }, // Cập nhật thông tin user
                }));
            },
            // ======================================
            // Action để xoá state khi đăng xuất
            logout: () => {
                set({ user: null, token: null });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);