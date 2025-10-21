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
    reservationId?: string;
    tableId?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: any; // đề phòng API có thêm field
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

export const fetchReservationDetailSuccess = (details: ReservationDetail[]): ReservationDetailAction => ({
    type: FETCH_RESERVATION_DETAIL_SUCCESS,
    payload: details,
});

export const fetchReservationDetailFailure = (error: string): ReservationDetailAction => ({
    type: FETCH_RESERVATION_DETAIL_FAILURE,
    payload: error,
});

// ------------------------------
// 🔹 Thunk: Lấy danh sách chi tiết đặt bàn
// ------------------------------
export const fetchReservationDetails = () => {
    return async (dispatch: (action: ReservationDetailAction) => void) => {
        dispatch(fetchReservationDetailRequest());
        try {
            // ✅ Sửa lỗi TS2551: dùng đúng "reservation_detail"
            const response = await http.get(`${API_ENDPOINT}${API_DATA.reservation_detail}`);
            dispatch(fetchReservationDetailSuccess(response.data));
        } catch (err: unknown) {
            // ✅ Sửa lỗi TS18046: "err" là unknown → cần ép kiểu
            const error = err as any;
            const errorMsg: string = error?.response?.data?.message || error?.message || "Lỗi không xác định";
            dispatch(fetchReservationDetailFailure(errorMsg));
        }
    };
};

// ------------------------------
// 🔹 Thunk: Thêm chi tiết đặt bàn mới
// ------------------------------
export const addNewReservationDetail = (detailData: ReservationDetail) => {
    return async (dispatch: (action: ReservationDetailAction) => void) => {
        dispatch(fetchReservationDetailRequest());
        try {
            const response = await http.post(`${API_ENDPOINT}${API_DATA.reservation_detail}`, detailData);
            dispatch(fetchReservationDetailSuccess(response.data));
            return response.data; // ✅ trả dữ liệu về cho component xử lý
        } catch (err: unknown) {
            const error = err as any;
            const errorMsg: string = error?.response?.data?.message || error?.message || "Lỗi không xác định";
            dispatch(fetchReservationDetailFailure(errorMsg));
            throw new Error(errorMsg); // ✅ component có thể bắt lỗi qua try/catch
        }
    };
};
