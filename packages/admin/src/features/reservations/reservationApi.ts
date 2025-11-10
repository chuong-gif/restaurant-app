// packages/admin/src/features/reservations/reservationApi.ts
import { baseApi } from '../../services/baseApi';
import { Reservation, ReservationListResponse, ReservationDetailResponse, ReservationDetailItem } from '../../types/reservation';

// Kiểu dữ liệu cho các tham số query
interface GetReservationsParams {
    page: number;
    limit: number; // Backend dùng limit
    searchName?: string;
    searchPhone?: string;
    reservation_code?: string;
    status?: string; // Backend nhận string
}

// Kiểu dữ liệu body cho cập nhật trạng thái
interface UpdateStatusBody {
    status: number;
}

// Kiểu dữ liệu body cho thay đổi món ăn
interface ChangeDishesBody {
    selectedChangedishes: Array<{ // Backend dùng key này
        product_id: number;
        quantity: number;
        // price không cần gửi, service tự lấy
    }>;
}

type AdminReservationNNInput = {
    fullname: string;
    tel: string;
    email?: string;
    reservation_date: string; // ISO String
    party_size: number;
    note?: string;
    products?: Array<{ product_id: number; quantity: number }>;
    ban_an_ids: number[]; // <-- Sửa từ ban_an_id (số ít) thành ban_an_ids (mảng)
    status?: number;
};


export const reservationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // 1. Query lấy danh sách đặt bàn (admin)
        getAdminReservations: builder.query<ReservationListResponse, GetReservationsParams>({
            query: (params) => ({
                url: '/admin/reservations', // Dựa trên reservation.admin.routes.ts
                params: params,
            }),
            providesTags: (result) => result ? [
                ...result.data.map(({ id }) => ({ type: 'Reservation' as const, id })), { type: 'Reservation', id: 'LIST' },
            ] : [{ type: 'Reservation', id: 'LIST' }],
        }),

        // 2. Query lấy chi tiết đặt bàn (admin)
        getAdminReservationById: builder.query<Reservation, number>({
            query: (id) => `/admin/reservations/${id}`,
            transformResponse: (response: ReservationDetailResponse) => response.data,
            providesTags: (result, error, id) => [{ type: 'Reservation', id }],
        }),

        // 3. Mutation cập nhật trạng thái đặt bàn
        updateReservationStatus: builder.mutation<Reservation, { id: number; status: number }>({
            query: ({ id, status }) => ({
                url: `/admin/reservations/${id}/status`,
                method: 'PATCH',
                body: { status }, // Gửi status trong body
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Reservation', id }, { type: 'Reservation', id: 'LIST' }],
        }),

        // 4. Mutation thay đổi món ăn
        changeReservationDishes: builder.mutation<void, { id: number; dishes: ChangeDishesBody['selectedChangedishes'] }>({
            query: ({ id, dishes }) => ({
                url: `/admin/reservations/${id}/change-dishes`,
                method: 'POST',
                body: { selectedChangedishes: dishes }, // Gửi đúng key backend cần
            }),
            // Cập nhật cả list và detail vì tổng tiền có thể thay đổi
            invalidatesTags: (result, error, { id }) => [{ type: 'Reservation', id }, { type: 'Reservation', id: 'LIST' }],
        }),

        // 5. Mutation xóa mềm đặt bàn (Hủy đơn)
        softDeleteReservation: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/admin/reservations/soft/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Reservation', id }, { type: 'Reservation', id: 'LIST' }],
        }),

        // 6. Mutation xóa vĩnh viễn đặt bàn
        permanentlyDeleteReservation: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/admin/reservations/permanent/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Reservation', id }, { type: 'Reservation', id: 'LIST' }],
        }),

        // === THÊM MUTATION MỚI CHO ADMIN TẠO ===
        createAdminReservation: builder.mutation<Reservation, AdminReservationNNInput>({ // <-- Dùng kiểu NNInput mới
            query: (newReservationData) => ({
                url: '/admin/reservations',
                method: 'POST',
                body: newReservationData, // Body này giờ chứa ban_an_ids
            }),
            invalidatesTags: [{ type: 'Reservation', id: 'LIST' }],
        }),
        // ======================================

    }),
});

export const {
    useGetAdminReservationsQuery,
    useGetAdminReservationByIdQuery,
    useUpdateReservationStatusMutation,
    useChangeReservationDishesMutation,
    useSoftDeleteReservationMutation, // Xóa mềm (Hủy)
    usePermanentlyDeleteReservationMutation, // Xóa cứng
    useCreateAdminReservationMutation,
} = reservationApi;