import { API_DATA, API_ENDPOINT } from "../configs/APIs";
import http from "../Utils/Http";

// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_RESERVATIONS_REQUEST = "FETCH_RESERVATIONS_REQUEST";
export const FETCH_RESERVATIONS_SUCCESS = "FETCH_RESERVATIONS_SUCCESS";
export const FETCH_RESERVATIONS_FAILURE = "FETCH_RESERVATIONS_FAILURE";
export const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";

// ------------------------------
// 🔹 Interfaces
// ------------------------------
export interface Reservation {
    id: string;
    user_id: string;
    fullname: string;
    tel: string;
    email: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: any;
}

export interface ReservationResponse {
    results: Reservation[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}

export interface ErrorResponse {
    response?: {
        data?: {
            message?: string;
        };
    };
    message?: string;
}

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchReservationsRequest = () => ({
    type: FETCH_RESERVATIONS_REQUEST as typeof FETCH_RESERVATIONS_REQUEST
});

export const fetchReservationsSuccess = (
    results: Reservation[],
    totalCount: number,
    totalPages: number,
    currentPage: number
) => ({
    type: FETCH_RESERVATIONS_SUCCESS as typeof FETCH_RESERVATIONS_SUCCESS,
    payload: { results, totalCount, totalPages, currentPage }
});

export const fetchReservationsFailure = (error: string) => ({
    type: FETCH_RESERVATIONS_FAILURE as typeof FETCH_RESERVATIONS_FAILURE,
    payload: error
});

export const setCurrentPage = (page: number) => ({
    type: SET_CURRENT_PAGE as typeof SET_CURRENT_PAGE,
    payload: page
});

// ------------------------------
// 🔹 Lấy danh sách đặt bàn của user
// ------------------------------
export const fetchReservations = (
    user_id: string,
    fullname: string = "",
    tel: string = "",
    email: string = "",
    status: string = "",
    page: number = 1,
    pageSize: number = 10
) => {
    return async (dispatch: (action: any) => void): Promise<void> => {
        dispatch(fetchReservationsRequest());

        const url = new URL(
            `${API_ENDPOINT}${API_DATA.reservations_client}${API_DATA.myBooking}/${user_id}`
        );

        if (fullname) url.searchParams.append("searchName", fullname);
        if (tel) url.searchParams.append("searchPhone", tel);
        if (email) url.searchParams.append("searchEmail", email);
        if (status) url.searchParams.append("status", status);

        // ép kiểu về string để không bị TS2345
        url.searchParams.append("page", String(page));
        url.searchParams.append("pageSize", String(pageSize));

        try {
            const response = await http.get<ReservationResponse>(url.toString());
            const { results, totalCount, totalPages, currentPage } = response.data;
            dispatch(fetchReservationsSuccess(results, totalCount, totalPages, currentPage));
        } catch (error: unknown) {
            const errorMsg =
                (error as ErrorResponse)?.response?.data?.message ||
                (error as ErrorResponse)?.message ||
                "Lỗi khi gọi API";
            dispatch(fetchReservationsFailure(errorMsg));
        }
    };
};

// ------------------------------
// 🔹 Lấy reservation theo ID
// ------------------------------
export const fetchReservationsID = (id: string) => {
    return async (dispatch: (action: any) => void): Promise<void> => {
        dispatch(fetchReservationsRequest());

        const url = new URL(`${API_ENDPOINT}${API_DATA.reservations_client}/${id}`);

        try {
            const response = await http.get<ReservationResponse>(url.toString());
            const { results, totalCount, totalPages, currentPage } = response.data;
            dispatch(fetchReservationsSuccess(results, totalCount, totalPages, currentPage));
        } catch (error: unknown) {
            const errorMsg =
                (error as ErrorResponse)?.response?.data?.message ||
                (error as ErrorResponse)?.message ||
                "Lỗi khi gọi API";
            dispatch(fetchReservationsFailure(errorMsg));
        }
    };
};

// ------------------------------
// 🔹 Cập nhật trạng thái reservation
// ------------------------------
export const updateReservations = (
    id: string,
    data: Record<string, any>,
    user_id: string,
    fullname: string = "",
    tel: string = "",
    email: string = "",
    status: string = "",
    page: number = 1,
    pageSize: number = 10
) => {
    return async (dispatch: (action: any) => void): Promise<void> => {
        dispatch(fetchReservationsRequest());
        try {
            await http.patch(`${API_ENDPOINT}${API_DATA.reservations_client}/${id}`, data);
            dispatch(fetchReservations(user_id, fullname, tel, email, status, page, pageSize));
        } catch (error: unknown) {
            const errorMsg =
                (error as ErrorResponse)?.response?.data?.message ||
                (error as ErrorResponse)?.message ||
                "Lỗi khi cập nhật dữ liệu";
            dispatch(fetchReservationsFailure(errorMsg));
        }
    };
};
