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

// Định nghĩa toàn bộ state của store
type BookingState = {
    info: Partial<BookingInfo>; // Thông tin cơ bản (Bước 1)
    selectedTable: BanAn | null; // Bàn đã chọn (Bước 2)
    cart: CartItem[]; // Món ăn đã chọn (Bước 2)

    // Actions
    setBookingInfo: (info: BookingInfo) => void;
    setSelectedTable: (table: BanAn | null) => void;
    addToCart: (product: SanPham) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearBooking: () => void;
    getTotalPrice: () => number;
};

const initialState = {
    info: {},
    selectedTable: null,
    cart: [],
};

export const useBookingStore = create<BookingState>()(
    persist(
        (set, get) => ({
            ...initialState,

            // === ACTIONS ===
            setBookingInfo: (info) => set({ info }),

            setSelectedTable: (table) => set({ selectedTable: table }),

            addToCart: (product) => {
                set((state) => {
                    const existingItem = state.cart.find(item => item.product_id === product.id);
                    if (existingItem) {
                        // Tăng số lượng nếu đã tồn tại
                        return {
                            cart: state.cart.map(item =>
                                item.product_id === product.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                        };
                    } else {
                        // Thêm mới vào giỏ hàng
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

            removeFromCart: (productId) => {
                set((state) => ({
                    cart: state.cart.filter(item => item.product_id !== productId),
                }));
            },

            updateQuantity: (productId, quantity) => {
                set((state) => ({
                    cart: state.cart.map(item =>
                        item.product_id === productId
                            ? { ...item, quantity: Math.max(0, quantity) } // Đảm bảo số lượng không âm
                            : item
                    ).filter(item => item.quantity > 0), // Xóa nếu số lượng là 0
                }));
            },

            clearBooking: () => set(initialState),

            getTotalPrice: () => {
                return get().cart.reduce((total, item) => total + (item.gia * item.quantity), 0);
            }
        }),
        {
            name: 'booking-storage', // Tên key trong localStorage
            storage: createJSONStorage(() => sessionStorage), // Dùng sessionStorage (tùy chọn)
        }
    )
);