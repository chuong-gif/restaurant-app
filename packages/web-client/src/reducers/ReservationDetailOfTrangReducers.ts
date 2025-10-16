import {
  FETCH_RESERVATIONDETAIL_REQUEST,
  FETCH_RESERVATIONDETAIL_SUCCESS,
  FETCH_RESERVATIONDETAIL_FAILURE,
} from "../Actions/ReservationDetailOfTrangActions";

// ------------------------------
// 🔹 Interfaces
// ------------------------------
export interface ReservationDetail {
  id?: number;
  reservationId?: number;
  tableId?: number;
  customerName?: string;
  date?: string;
  time?: string;
  status?: string;
  [key: string]: any;
}

export interface ReservationDetailState {
  loading: boolean;
  reservationDetail: ReservationDetail[];
  error: string;
}

export interface ReservationDetailAction {
  type: string;
  payload?: any;
}

// ------------------------------
// 🔹 Initial State
// ------------------------------
const initialState: ReservationDetailState = {
  loading: false,
  reservationDetail: [],
  error: "",
};

// ------------------------------
// 🔹 Reducer
// ------------------------------
const ReservationDetailReducer = (
  state = initialState,
  action: ReservationDetailAction
): ReservationDetailState => {
  switch (action.type) {
    case FETCH_RESERVATIONDETAIL_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case FETCH_RESERVATIONDETAIL_SUCCESS:
      return {
        loading: false,
        reservationDetail: Array.isArray(action.payload)
          ? action.payload
          : [],
        error: "",
      };

    case FETCH_RESERVATIONDETAIL_FAILURE:
      return {
        loading: false,
        reservationDetail: [],
        error: action.payload,
      };

    default:
      return state;
  }
};

export default ReservationDetailReducer;
