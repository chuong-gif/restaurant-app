// packages/client/src/store/useBookingStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { BanAn } from '@/types/table'; // Chúng ta sẽ tạo file này ở bước sau
import { SanPham } from '@/types/product'; // Và file này

// Định nghĩa kiểu dữ liệu cho một món ăn trong giỏ hàng
export type CartItem = {
    product_id: number;
    ten_san_pham: string;
    gia: number;
    hinh_anh: string;
    quantity: number;
};

// Định nghĩa thông tin cơ bản của đơn
type BookingInfo = {
    fullname: string;
    email: string;
    tel: string;
    reservation_date: string; // Lưu dưới dạng ISO string
    party_size: number;
    note?: string;
};
// Thêm kiểu dữ liệu cho mã khuyến mãi
type AppliedPromo = {
    id: number;
    code: string;
    discount: number;
    discount_type: boolean; // false = số tiền, true = phần trăm
} | null;

// Định nghĩa toàn bộ state của store
type BookingState = {
    info: Partial<BookingInfo>;
    selectedTables: BanAn[];
    cart: CartItem[];
    appliedPromo: AppliedPromo;

    // Actions
    setBookingInfo: (info: BookingInfo) => void;
    toggleTable: (table: BanAn) => void;
    getTotalCapacity: () => number;
    addToCart: (product: SanPham) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearBooking: () => void;
    getTotalPrice: () => number;
    applyPromo: (promo: AppliedPromo) => void;
    removePromo: () => void;
    getDiscountAmount: () => number;
    getDiscountedTotal: () => number;
};


const initialState = {
    info: {},
    selectedTables: [],
    cart: [],
    appliedPromo: null,
};

export const useBookingStore = create<BookingState>()(
    persist(
        (set, get) => ({
            ...initialState,

            setBookingInfo: (info: BookingInfo) => set({ info }),

            toggleTable: (table: BanAn) => {
                set((state) => {
                    const isSelected = state.selectedTables.some(t => t.id === table.id);
                    if (isSelected) {
                        return {
                            selectedTables: state.selectedTables.filter(t => t.id !== table.id)
                        };
                    } else {
                        return {
                            selectedTables: [...state.selectedTables, table]
                        };
                    }
                });
            },

            getTotalCapacity: () => {
                return get().selectedTables.reduce((total, table) => total + table.suc_chua, 0);
            },

            addToCart: (product: SanPham) => {
                set((state) => {
                    const existingItem = state.cart.find(item => item.product_id === product.id);
                    if (existingItem) {
                        return {
                            cart: state.cart.map(item =>
                                item.product_id === product.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                        };
                    } else {
                        const newItem: CartItem = {
                            product_id: product.id,
                            ten_san_pham: product.ten_san_pham,
                            gia: product.gia_khuyen_mai > 0 ? product.gia_khuyen_mai : product.gia_ban,
                            hinh_anh: (product.media_files as any)?.file_url || '/images/logo.png',
                            quantity: 1,
                        };
                        return { cart: [...state.cart, newItem] };
                    }
                });
            },

            removeFromCart: (productId: number) => {
                set((state) => ({
                    cart: state.cart.filter(item => item.product_id !== productId),
                }));
            },

            updateQuantity: (productId: number, quantity: number) => {
                set((state) => ({
                    cart: state.cart.map(item =>
                        item.product_id === productId
                            ? { ...item, quantity: Math.max(0, quantity) }
                            : item
                    ).filter(item => item.quantity > 0),
                }));
            },

            clearBooking: () => set(initialState),

            getTotalPrice: () => {
                return get().cart.reduce((total, item) => total + (item.gia * item.quantity), 0);
            },

            // === ACTIONS MỚI CHO MÃ KHUYẾN MÃI ===
            applyPromo: (promo: AppliedPromo) => set({ appliedPromo: promo }),

            removePromo: () => set({ appliedPromo: null }),

            getDiscountAmount: () => {
                const state = get();
                if (!state.appliedPromo) return 0;

                const total = state.cart.reduce((sum: number, item: CartItem) =>
                    sum + (item.gia * item.quantity), 0);

                if (state.appliedPromo.discount_type === false) { // false = số tiền
                    return state.appliedPromo.discount;
                } else { // true = phần trăm
                    return (total * state.appliedPromo.discount) / 100;
                }
            },

            getDiscountedTotal: () => {
                const state = get();
                const total = state.cart.reduce((sum: number, item: CartItem) =>
                    sum + (item.gia * item.quantity), 0);
                const discount = get().getDiscountAmount();
                return Math.max(0, total - discount);
            }
        }),
        {
            name: 'booking-storage',
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                info: state.info,
                selectedTables: state.selectedTables,
                cart: state.cart,
                appliedPromo: state.appliedPromo,
            }),
        }
    )
);