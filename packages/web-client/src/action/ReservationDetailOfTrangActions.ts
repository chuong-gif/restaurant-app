// Action Types
export const FETCH_RESERVATIONDETAIL_REQUEST = 'FETCH_RESERVATIONDETAIL_REQUEST';
export const FETCH_RESERVATIONDETAIL_SUCCESS = 'FETCH_RESERVATIONDETAIL_SUCCESS';
export const FETCH_RESERVATIONDETAIL_FAILURE = 'FETCH_RESERVATIONDETAIL_FAILURE';

// Import API config
import { API_ENDPOINT, API_DATA } from "../Config/Client/APIs";
import http from "../Utils/Http";

// Action Creators
export const fetchReservationdetailRequest = () => ({
    type: FETCH_RESERVATIONDETAIL_REQUEST,
});

export const fetchReservationdetailSuccess = (results) => ({
    type: FETCH_RESERVATIONDETAIL_SUCCESS,
    payload: results,
});

export const fetchReservationdetailFailure = (error) => ({
    type: FETCH_RESERVATIONDETAIL_FAILURE,
    payload: error,
});

// Thunk to fetch reservation details by reservation ID
export const fetchReservationdetail = (id) => {
    return (dispatch) => {
        dispatch(fetchReservationdetailRequest());
        http.get(`${API_ENDPOINT}${API_DATA.reservations_client}/reservation_details/${id}`)
            .then((response) => {
                dispatch(fetchReservationdetailSuccess(response.data.results));
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.message || error.message;
                dispatch(fetchReservationdetailFailure(errorMsg));
            });
    };
};
