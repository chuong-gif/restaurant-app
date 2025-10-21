// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_RESERVATION_DETAIL_REQUEST = "FETCH_RESERVATION_DETAIL_REQUEST";
export const FETCH_RESERVATION_DETAIL_SUCCESS = "FETCH_RESERVATION_DETAIL_SUCCESS";
export const FETCH_RESERVATION_DETAIL_FAILURE = "FETCH_RESERVATION_DETAIL_FAILURE";

// ------------------------------
// 🔹 Import API config
// ------------------------------
import { API_ENDPOINT, API_DATA } from "../configs/APIs";
import http from "../Utils/Http";

// ------------------------------
// 🔹 Kiểu dữ liệu
// ------------------------------
export interface ReservationDetail {
    id: string;
    reservation_code?: string;
    userId?: string;
    tableId?: string;
    total?: number;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: any;
}

export interface ReservationDetailAction {
    type: string;
    payload?: any;
}

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchReservationDetailRequest = (): ReservationDetailAction => ({
    type: FETCH_RESERVATION_DETAIL_REQUEST,
});

export const fetchReservationDetailSuccess = (results: ReservationDetail): ReservationDetailAction => ({
    type: FETCH_RESERVATION_DETAIL_SUCCESS,
    payload: results,
});

export const fetchReservationDetailFailure = (error: string): ReservationDetailAction => ({
    type: FETCH_RESERVATION_DETAIL_FAILURE,
    payload: error,
});

// ------------------------------
// 🔹 Thunk: Lấy chi tiết đặt bàn theo ID
// ------------------------------
export const fetchReservationDetailById = (id: string) => {
    return async (dispatch: (action: ReservationDetailAction) => void) => {
        dispatch(fetchReservationDetailRequest());
        try {
            const response = await http.get(`${API_ENDPOINT}${API_DATA.reservations}/${id}`);
            dispatch(fetchReservationDetailSuccess(response.data));
            return response.data; // ✅ Trả dữ liệu về component
        } catch (err: unknown) {
            const error = err as any;
            const errorMsg: string = error?.response?.data?.message || error?.message || "Lỗi không xác định";
            dispatch(fetchReservationDetailFailure(errorMsg));
            throw new Error(errorMsg);
        }
    };
};
