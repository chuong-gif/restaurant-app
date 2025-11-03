import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User } from '@/types/user';

type AuthState = {
    user: User | null;
    token: string | null;
    setUserToken: (user: User, token: string) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>()(
    // Persist middleware để tự động lưu state vào localStorage
    persist(
        (set) => ({
            user: null,
            token: null,
            // Action để set user và token khi đăng nhập
            setUserToken: (user, token) => {
                set({ user, token });
            },
            // Action để xoá state khi đăng xuất (giống handleLogout [cite: 16-20])
            logout: () => {
                set({ user: null, token: null });
                // (localStorage sẽ tự động được xoá bởi 'persist')
            },
        }),
        {
            name: 'auth-storage', // Tên key trong localStorage
            storage: createJSONStorage(() => localStorage),
        }
    )
);