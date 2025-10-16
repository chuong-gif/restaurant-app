// Action Types
export const FETCH_RESERVATION_DETAIL_REQUEST = "FETCH_RESERVATION_DETAIL_REQUEST";
export const FETCH_RESERVATION_DETAIL_SUCCESS = "FETCH_RESERVATION_DETAIL_SUCCESS";
export const FETCH_RESERVATION_DETAIL_FAILURE = "FETCH_RESERVATION_DETAIL_FAILURE";

// Import API config
import { API_ENDPOINT, API_DATA } from "../Config/Client/APIs";
import http from "../Utils/Http";

// Action Creators
export const fetchReservationDetailRequest = () => ({
    type: FETCH_RESERVATION_DETAIL_REQUEST,
});

export const fetchReservationDetailSuccess = (details) => ({
    type: FETCH_RESERVATION_DETAIL_SUCCESS,
    payload: details,
});

export const fetchReservationDetailFailure = (error) => ({
    type: FETCH_RESERVATION_DETAIL_FAILURE,
    payload: error,
});

// Thunk to fetch reservation details
export const fetchReservationDetails = () => {
    return async (dispatch) => {
        dispatch(fetchReservationDetailRequest());
        try {
            const response = await http.get(`${API_ENDPOINT}${API_DATA.reservationDetails}`);
            dispatch(fetchReservationDetailSuccess(response.data));
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            dispatch(fetchReservationDetailFailure(errorMsg));
        }
    };
};

// Thunk to add a new reservation detail
export const addNewReservationDetail = (detailData) => {
    return async (dispatch) => {
        dispatch(fetchReservationDetailRequest());
        try {
            const response = await http.post(`${API_ENDPOINT}${API_DATA.reservation_detail}`, detailData);
            dispatch(fetchReservationDetailSuccess(response.data));
            return response.data; // trả về dữ liệu để component xử lý
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            dispatch(fetchReservationDetailFailure(errorMsg));
            throw new Error(errorMsg); // ném lỗi để component bắt
        }
    };
};
