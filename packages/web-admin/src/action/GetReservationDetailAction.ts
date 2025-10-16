import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { API_ENDPOINT, API_DATA } from "../Config/APIs";
import http from "../Utils/Http";

// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_RESERVATIONDETAIL_REQUEST = 'FETCH_RESERVATIONDETAIL_REQUEST';
export const FETCH_RESERVATIONDETAIL_SUCCESS = 'FETCH_RESERVATIONDETAIL_SUCCESS';
export const FETCH_RESERVATIONDETAIL_FAILURE = 'FETCH_RESERVATIONDETAIL_FAILURE';

// ------------------------------
// 🔹 Interfaces
// ------------------------------
export interface ReservationDetail {
    id: number;
    reservationId: number;
    tableId: number;
    guestName: string;
    [key: string]: any;
}

interface FetchReservationDetailRequestAction {
    type: typeof FETCH_RESERVATIONDETAIL_REQUEST;
}

interface FetchReservationDetailSuccessAction {
    type: typeof FETCH_RESERVATIONDETAIL_SUCCESS;
    payload: ReservationDetail[] | {
        data: ReservationDetail[];
        totalItems: number;
        totalPages: number;
        currentPage: number;
    };
}

interface FetchReservationDetailFailureAction {
    type: typeof FETCH_RESERVATIONDETAIL_FAILURE;
    payload: string;
}

export type ReservationDetailActions =
    | FetchReservationDetailRequestAction
    | FetchReservationDetailSuccessAction
    | FetchReservationDetailFailureAction;

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchReservationdetailRequest = (): FetchReservationDetailRequestAction => ({
    type: FETCH_RESERVATIONDETAIL_REQUEST
});

export const fetchReservationdetailSuccess = (
    results: ReservationDetail[] | { data: ReservationDetail[]; totalItems: number; totalPages: number; currentPage: number }
): FetchReservationDetailSuccessAction => ({
    type: FETCH_RESERVATIONDETAIL_SUCCESS,
    payload: results
});

export const fetchReservationdetailFailure = (error: string): FetchReservationDetailFailureAction => ({
    type: FETCH_RESERVATIONDETAIL_FAILURE,
    payload: error
});

// ------------------------------
// 🔹 Thunk Actions
// ------------------------------
export const fetchReservationdetail = (
    id: number
): ThunkAction<Promise<void>, {}, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(fetchReservationdetailRequest());
        try {
            const response = await http.get(`${API_ENDPOINT}/${API_DATA.reservations_admin}/reservation_details/${id}`);
            dispatch(fetchReservationdetailSuccess(response.data.results));
        } catch (error: any) {
            dispatch(fetchReservationdetailFailure(error.message || 'Failed to fetch reservation details'));
        }
    };
};

export const fetchReservationdetail2 = (
    id: number,
    page = 1,
    pageSize = 10
): ThunkAction<Promise<void>, {}, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(fetchReservationdetailRequest());
        try {
            const response = await http.get(
                `${API_ENDPOINT}/${API_DATA.reservations_admin}/reservation_details/${id}?page=${page}&pageSize=${pageSize}`
            );
            const { results, totalItems, totalPages } = response.data;
            dispatch(fetchReservationdetailSuccess({
                data: results,
                totalItems,
                totalPages,
                currentPage: page
            }));
        } catch (error: any) {
            dispatch(fetchReservationdetailFailure(error.message || 'Failed to fetch reservation details'));
        }
    };
};
