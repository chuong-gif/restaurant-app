// Action Types
export const FETCH_RESERVATION_REQUEST = "FETCH_RESERVATION_REQUEST";
export const FETCH_RESERVATION_SUCCESS = "FETCH_RESERVATION_SUCCESS";
export const FETCH_RESERVATION_FAILURE = "FETCH_RESERVATION_FAILURE";

// Import API config
import { API_ENDPOINT, API_DATA } from "../Config/Client/APIs";
import http from "../Utils/Http";

// Action Creators
export const fetchReservationRequest = () => ({
    type: FETCH_RESERVATION_REQUEST,
});

export const fetchReservationSuccess = (reservation) => ({
    type: FETCH_RESERVATION_SUCCESS,
    payload: reservation,
});

export const fetchReservationFailure = (error) => ({
    type: FETCH_RESERVATION_FAILURE,
    payload: error,
});

// Thunk to Add a New Reservation
export const addNewReservation = (reservationData) => {
    return async (dispatch) => {
        dispatch(fetchReservationRequest());
        try {
            const response = await http.post(`${API_ENDPOINT}${API_DATA.reservations}`, reservationData);
            dispatch(fetchReservationSuccess(response.data));
            return response.data; // Trả về dữ liệu đơn đặt chỗ
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            dispatch(fetchReservationFailure(errorMsg));
            throw new Error(errorMsg); // Ném lỗi để bắt trong component
        }
    };
};

// Thunk Request MoMo Payment
export const requestMomoPayment = (reservationId, amount, reservation_code) => async (dispatch) => {
    try {
        const response = await http.post('http://localhost:6969/api/public/payment', {
            reservationId,
            amount,
            reservation_code,
        });
        return response.data; // Trả về dữ liệu để xử lý tiếp
    } catch (error) {
        console.error("Error in MoMo payment request:", error);
        throw error;
    }
};

// Thunk Request MoMo Payment URL
export const requestMomoPayUrl = (reservationId, amount) => async (dispatch) => {
    try {
        const response = await http.post('http://localhost:6969/api/public/payment/get_pay_url', {
            reservationId,
            amount,
        });
        return response.data; // Trả về dữ liệu để xử lý tiếp
    } catch (error) {
        console.error("Error in MoMo payment URL request:", error);
        throw error;
    }
};

// Thunk Request MoMo Payment Balance
export const requestMomoPaymentBalance = (reservationId, amount) => async (dispatch) => {
    try {
        const response = await http.post('http://localhost:6969/api/public/payment/pay_balance', {
            reservationId,
            amount,
        });
        return response.data; // Trả về dữ liệu để xử lý tiếp
    } catch (error) {
        console.error("Error in MoMo payment balance request:", error);
        throw error;
    }
};
