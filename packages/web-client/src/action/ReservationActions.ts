// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_RESERVATION_REQUEST = "FETCH_RESERVATION_REQUEST";
export const FETCH_RESERVATION_SUCCESS = "FETCH_RESERVATION_SUCCESS";
export const FETCH_RESERVATION_FAILURE = "FETCH_RESERVATION_FAILURE";

// ------------------------------
// 🔹 Import API config
// ------------------------------
import { API_ENDPOINT, API_DATA } from "../configs/APIs";
import http from "../Utils/Http";

// ------------------------------
// 🔹 Kiểu dữ liệu
// ------------------------------
export interface Reservation {
    id: string;
    userId?: string;
    tableId?: string;
    reservation_code?: string;
    amount?: number;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: any;
}

export interface ReservationAction {
    type: string;
    payload?: any;
}

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchReservationRequest = (): ReservationAction => ({
    type: FETCH_RESERVATION_REQUEST,
});

export const fetchReservationSuccess = (reservation: Reservation): ReservationAction => ({
    type: FETCH_RESERVATION_SUCCESS,
    payload: reservation,
});

export const fetchReservationFailure = (error: string): ReservationAction => ({
    type: FETCH_RESERVATION_FAILURE,
    payload: error,
});

// ------------------------------
// 🔹 Thunk: Thêm đặt chỗ mới
// ------------------------------
export const addNewReservation = (reservationData: Reservation) => {
    return async (dispatch: (action: ReservationAction) => void) => {
        dispatch(fetchReservationRequest());
        try {
            const response = await http.post(`${API_ENDPOINT}${API_DATA.reservations}`, reservationData);
            dispatch(fetchReservationSuccess(response.data));
            return response.data; // ✅ Trả về dữ liệu cho component
        } catch (err: unknown) {
            // ✅ Xử lý TS18046: err là unknown
            const error = err as any;
            const errorMsg: string = error?.response?.data?.message || error?.message || "Lỗi không xác định";
            dispatch(fetchReservationFailure(errorMsg));
            throw new Error(errorMsg);
        }
    };
};

// ------------------------------
// 🔹 Thunk: Gọi thanh toán MoMo (Payment)
// ------------------------------
export const requestMomoPayment = (
    reservationId: string,
    amount: number,
    reservation_code: string
) => async (_dispatch: (action: ReservationAction) => void) => {
    try {
        const response = await http.post("http://localhost:6969/api/public/payment", {
            reservationId,
            amount,
            reservation_code,
        });
        return response.data;
    } catch (err: unknown) {
        const error = err as any;
        console.error("Error in MoMo payment request:", error?.message || error);
        throw error;
    }
};

// ------------------------------
// 🔹 Thunk: Lấy URL thanh toán MoMo
// ------------------------------
export const requestMomoPayUrl = (
    reservationId: string,
    amount: number
) => async (_dispatch: (action: ReservationAction) => void) => {
    try {
        const response = await http.post("http://localhost:6969/api/public/payment/get_pay_url", {
            reservationId,
            amount,
        });
        return response.data;
    } catch (err: unknown) {
        const error = err as any;
        console.error("Error in MoMo payment URL request:", error?.message || error);
        throw error;
    }
};

// ------------------------------
// 🔹 Thunk: Thanh toán phần còn lại
// ------------------------------
export const requestMomoPaymentBalance = (
    reservationId: string,
    amount: number
) => async (_dispatch: (action: ReservationAction) => void) => {
    try {
        const response = await http.post("http://localhost:6969/api/public/payment/pay_balance", {
            reservationId,
            amount,
        });
        return response.data;
    } catch (err: unknown) {
        const error = err as any;
        console.error("Error in MoMo payment balance request:", error?.message || error);
        throw error;
    }
};
