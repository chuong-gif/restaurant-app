import {
  FETCH_RESERVATION_REQUEST,
  FETCH_RESERVATION_SUCCESS,
  FETCH_RESERVATION_FAILURE,
} from "../Actions/ReservationActions";

// ------------------------------
// 🔹 Interfaces
// ------------------------------
export interface ReservationDetail {
  id?: number;
  reservationId?: number;
  tableId?: number;
  customerId?: number;
  date?: string;
  time?: string;
  status?: string;
  [key: string]: any;
}

export interface ReservationDetailState {
  loading: boolean;
  reservationDetails: ReservationDetail[];
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
  reservationDetails: [],
  error: "",
};

// ------------------------------
// 🔹 Reducer
// ------------------------------
const reservationDetailReducer = (
  state = initialState,
  action: ReservationDetailAction
): ReservationDetailState => {
  switch (action.type) {
    case FETCH_RESERVATION_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_RESERVATION_SUCCESS:
      return {
        ...state,
        loading: false,
        reservationDetails: Array.isArray(action.payload)
          ? action.payload
          : [],
        error: "",
      };

    case FETCH_RESERVATION_FAILURE:
      return {
        ...state,
        loading: false,
        reservationDetails: [],
        error: action.payload,
      };

    default:
      return state;
  }
};

export default reservationDetailReducer;
