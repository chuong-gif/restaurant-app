import { API_DATA, API_ENDPOINT } from "../configs/client/APIs";
import AdminConfig from '../configs/client/index';
import http from "../Utils/Http";
import { fetchReservationdetail } from "./RevenueTimeAction";

import type { ThunkDispatch } from "redux-thunk";
import type { AnyAction } from "redux";
import type { AxiosError } from "axios";

// -----------------------------
// Types
// -----------------------------
export interface Reservation {
  id?: number | string;
  fullname?: string;
  tel?: string;
  email?: string;
  status?: string;
  reservation_code?: string;
  [key: string]: any;
}

export interface FetchParams {
  fullname?: string;
  tel?: string;
  email?: string;
  status?: string;
  reservation_code?: string;
  page?: number;
  pageSize?: number;
}

export type AppDispatch = ThunkDispatch<any, any, AnyAction>;

// -----------------------------
// Action Types
// -----------------------------
export const FETCH_RESERVATIONS_REQUEST = 'FETCH_RESERVATIONS_REQUEST';
export const FETCH_RESERVATIONS_SUCCESS = 'FETCH_RESERVATIONS_SUCCESS';
export const FETCH_RESERVATIONS_FAILURE = 'FETCH_RESERVATIONS_FAILURE';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const SET_LIMIT = 'SET_LIMIT';

// -----------------------------
// Action Creators
// -----------------------------
export const fetchReservationsRequest = () => ({ type: FETCH_RESERVATIONS_REQUEST });

export const fetchReservationsSuccess = (
  results: Reservation[],
  totalCount = 0,
  totalPages = 0,
  currentPage = 1
) => ({
  type: FETCH_RESERVATIONS_SUCCESS,
  payload: { results, totalCount, totalPages, currentPage },
});

export const fetchReservationsFailure = (error: string) => ({
  type: FETCH_RESERVATIONS_FAILURE,
  payload: error,
});

export const setCurrentPage = (page: number) => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});

export const setLimit = (limit: number) => ({
  type: SET_LIMIT,
  payload: limit,
});

// -----------------------------
// Helper: Build URL
// -----------------------------
const buildReservationsURL = ({
  fullname = '',
  tel = '',
  email = '',
  status = '',
  reservation_code = '',
  page = 1,
  pageSize = 5,
}: FetchParams): string => {
  const url = new URL(`${API_ENDPOINT}/${API_DATA.reservations_admin}`);
  if (fullname) url.searchParams.append('searchName', fullname);
  if (tel) url.searchParams.append('searchPhone', tel);
  if (email) url.searchParams.append('searchEmail', email);
  if (status) url.searchParams.append('status', status);
  if (reservation_code) url.searchParams.append('reservation_code', reservation_code);
  url.searchParams.append('page', String(page));
  url.searchParams.append('limit', String(pageSize));
  return url.toString();
};

// -----------------------------
// Thunks
// -----------------------------
export const fetchReservations =
  (params: FetchParams = {}) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(fetchReservationsRequest());
    try {
      const limit = parseInt(localStorage.getItem('limit') ?? '5', 10);
      const url = buildReservationsURL({ ...params, pageSize: limit });
      const response = await http.get(url);
      const { results, totalCount, totalPages, currentPage } = response.data;
      dispatch(fetchReservationsSuccess(results, totalCount, totalPages, currentPage));
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      const msg = error.response?.data?.message || error.message || "Lỗi không xác định";
      dispatch(fetchReservationsFailure(msg));
    }
  };

export const fetchReservationsByID =
  (id: number | string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(fetchReservationsRequest());
    try {
      const url = `${API_ENDPOINT}/${API_DATA.reservations_admin}/${id}`;
      const response = await http.get(url);
      dispatch(fetchReservationsSuccess(response.data.results));
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      const msg = error.response?.data?.message || error.message || "Lỗi không xác định";
      dispatch(fetchReservationsFailure(msg));
    }
  };

export const addReservation =
  (reservation: Reservation) =>
  async (dispatch: AppDispatch): Promise<any> => {
    dispatch(fetchReservationsRequest());
    try {
      const response = await http.post(`${API_ENDPOINT}/${AdminConfig.routes.reservations_t_admin}`, reservation);
      dispatch(fetchReservationsSuccess(response.data));
      dispatch(fetchReservations()); // reload danh sách
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosError<{ error?: string }>;
      const msg = error.response?.data?.error || error.message || "Lỗi không xác định";
      throw new Error(msg);
    }
  };

export const updateReservation =
  (id: number | string, data: Partial<Reservation>, params: FetchParams = {}) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(fetchReservationsRequest());
    try {
      await http.patch(`${API_ENDPOINT}/${AdminConfig.routes.reservations_t_admin}/reservation_ad/${id}`, data);
      dispatch(fetchReservations(params));
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      const msg = error.response?.data?.message || error.message || "Lỗi không xác định";
      dispatch(fetchReservationsFailure(msg));
    }
  };

export const deleteReservation =
  (id: number | string, params: FetchParams = {}) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(fetchReservationsRequest());
    try {
      await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.reservations_t_admin}/${id}`);
      dispatch(fetchReservations(params));
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      const msg = error.response?.data?.message || error.message || "Lỗi không xác định";
      dispatch(fetchReservationsFailure(msg));
    }
  };

export const deleteReservationDetail =
  (reservationId: number | string, productId: number | string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(fetchReservationsRequest());
    try {
      await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.reservations_t_admin}/${reservationId}/${productId}`);
      dispatch(fetchReservationdetail(reservationId));
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      const msg = error.response?.data?.message || error.message || "Lỗi không xác định";
      dispatch(fetchReservationsFailure(msg));
    }
  };
