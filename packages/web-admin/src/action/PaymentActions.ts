import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { API_ENDPOINT, API_DATA } from "../Config/APIs";
import http from "../Utils/Http";

// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_RESERVATION_REQUEST = "FETCH_RESERVATION_REQUEST";
export const FETCH_RESERVATION_SUCCESS = "FETCH_RESERVATION_SUCCESS";
export const FETCH_RESERVATION_FAILURE = "FETCH_RESERVATION_FAILURE";

// ------------------------------
// 🔹 Interfaces
// ------------------------------
export interface Reservation {
  id: number;
  customerId: number;
  tableId: number;
  totalAmount: number;
  status: string;
  [key: string]: any;
}

interface FetchReservationRequestAction {
  type: typeof FETCH_RESERVATION_REQUEST;
}

interface FetchReservationSuccessAction {
  type: typeof FETCH_RESERVATION_SUCCESS;
  payload: Reservation[];
}

interface FetchReservationFailureAction {
  type: typeof FETCH_RESERVATION_FAILURE;
  payload: string;
}

export type ReservationActions =
  | FetchReservationRequestAction
  | FetchReservationSuccessAction
  | FetchReservationFailureAction;

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchReservationRequest = (): FetchReservationRequestAction => ({
  type: FETCH_RESERVATION_REQUEST,
});

export const fetchReservationSuccess = (
  reservation: Reservation[]
): FetchReservationSuccessAction => ({
  type: FETCH_RESERVATION_SUCCESS,
  payload: reservation,
});

export const fetchReservationFailure = (error: string): FetchReservationFailureAction => ({
  type: FETCH_RESERVATION_FAILURE,
  payload: error,
});

// ------------------------------
// 🔹 Thunk Actions
// ------------------------------
export const fetchReservations = (): ThunkAction<Promise<void>, {}, unknown, AnyAction> => {
  return async (dispatch) => {
    dispatch(fetchReservationRequest());
    try {
      const response = await http.get(`${API_ENDPOINT}/${API_DATA.reservations_admin}`);
      dispatch(fetchReservationSuccess(response.data.results));
    } catch (error: any) {
      dispatch(fetchReservationFailure(error.message || "Failed to fetch reservations"));
    }
  };
};

// ------------------------------
// 🔹 MoMo Payment Request
// ------------------------------
export const requestMomoPaymentBalance = (
  reservationId: number,
  amount: number
): ThunkAction<Promise<any>, {}, unknown, AnyAction> => {
  return async () => {
    try {
      const response = await http.post(
        "http://localhost:6969/api/public/payment/pay_balance",
        { reservationId, amount }
      );
      return response.data; // Trả về dữ liệu để xử lý tiếp
    } catch (error: any) {
      console.error("Error in MoMo payment request:", error);
      throw error;
    }
  };
};
