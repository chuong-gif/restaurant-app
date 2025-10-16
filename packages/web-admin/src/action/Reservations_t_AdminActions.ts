import { API_DATA, API_ENDPOINT } from "../Config/APIs";
import AdminConfig from '../Config/index';
import http from "../Utils/Http";
import { fetchReservationdetail } from "./ReservationDetailActions"; // Nếu cần

export const FETCH_RESERVATIONS_REQUEST = 'FETCH_RESERVATIONS_REQUEST';
export const FETCH_RESERVATIONS_SUCCESS = 'FETCH_RESERVATIONS_SUCCESS';
export const FETCH_RESERVATIONS_FAILURE = 'FETCH_RESERVATIONS_FAILURE';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const SET_LIMIT = 'SET_LIMIT';

export const fetchReservationsRequest = () => ({ type: FETCH_RESERVATIONS_REQUEST });
export const fetchReservationsSuccess = (results, totalCount=0, totalPages=0, currentPage=1) => ({
    type: FETCH_RESERVATIONS_SUCCESS,
    payload: { results, totalCount, totalPages, currentPage }
});
export const fetchReservationsFailure = (error) => ({ type: FETCH_RESERVATIONS_FAILURE, payload: error });
export const setCurrentPage = (page) => ({ type: SET_CURRENT_PAGE, payload: page });
export const setLimit = (limit) => ({ type: SET_LIMIT, payload: limit });

// 🔹 Hàm helper tạo URL với search + pagination
const buildReservationsURL = ({ fullname='', tel='', email='', status='', reservation_code='', page=1, pageSize=5 }) => {
    const url = new URL(`${API_ENDPOINT}/${API_DATA.reservations_admin}`);
    if (fullname) url.searchParams.append('searchName', fullname);
    if (tel) url.searchParams.append('searchPhone', tel);
    if (email) url.searchParams.append('searchEmail', email);
    if (status) url.searchParams.append('status', status);
    if (reservation_code) url.searchParams.append('reservation_code', reservation_code);
    url.searchParams.append('page', page);
    url.searchParams.append('limit', pageSize);
    return url.toString();
};

// 🔹 Fetch danh sách reservations
export const fetchReservations = (params={}) => {
    return async (dispatch) => {
        dispatch(fetchReservationsRequest());
        try {
            const limit = parseInt(localStorage.getItem('limit'), 10) || 5;
            const url = buildReservationsURL({ ...params, pageSize: limit });
            const response = await http.get(url);
            const { results, totalCount, totalPages, currentPage } = response.data;
            dispatch(fetchReservationsSuccess(results, totalCount, totalPages, currentPage));
        } catch (error) {
            dispatch(fetchReservationsFailure(error.response?.data?.message || error.message));
        }
    };
};

// 🔹 Fetch reservations theo ID
export const fetchReservationsByID = (id) => {
    return async (dispatch) => {
        dispatch(fetchReservationsRequest());
        try {
            const url = `${API_ENDPOINT}/${API_DATA.reservations_admin}/${id}`;
            const response = await http.get(url);
            dispatch(fetchReservationsSuccess(response.data.results));
        } catch (error) {
            dispatch(fetchReservationsFailure(error.response?.data?.message || error.message));
        }
    };
};

// 🔹 Thêm reservation mới
export const addReservation = (reservation) => {
    return async (dispatch) => {
        dispatch(fetchReservationsRequest());
        try {
            const response = await http.post(`${API_ENDPOINT}/${AdminConfig.routes.reservations_t_admin}`, reservation);
            dispatch(fetchReservationsSuccess(response.data));
            dispatch(fetchReservations()); // reload danh sách
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || error.message || 'Lỗi không xác định');
        }
    };
};

// 🔹 Update reservation
export const updateReservation = (id, data, params={}) => {
    return async (dispatch) => {
        dispatch(fetchReservationsRequest());
        try {
            await http.patch(`${API_ENDPOINT}/${AdminConfig.routes.reservations_t_admin}/reservation_ad/${id}`, data);
            dispatch(fetchReservations(params));
        } catch (error) {
            dispatch(fetchReservationsFailure(error.response?.data?.message || error.message));
        }
    };
};

// 🔹 Delete reservation
export const deleteReservation = (id, params={}) => {
    return async (dispatch) => {
        dispatch(fetchReservationsRequest());
        try {
            await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.reservations_t_admin}/${id}`);
            dispatch(fetchReservations(params));
        } catch (error) {
            dispatch(fetchReservationsFailure(error.response?.data?.message || error.message));
        }
    };
};

// 🔹 Delete reservation detail (product)
export const deleteReservationDetail = (reservationId, productId) => {
    return async (dispatch) => {
        dispatch(fetchReservationsRequest());
        try {
            await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.reservations_t_admin}/${reservationId}/${productId}`);
            dispatch(fetchReservationdetail(reservationId));
        } catch (error) {
            dispatch(fetchReservationsFailure(error.response?.data?.message || error.message));
        }
    };
};
