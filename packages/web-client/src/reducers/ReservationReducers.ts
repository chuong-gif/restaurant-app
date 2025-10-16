import {
  FETCH_RESERVATION_REQUEST,
  FETCH_RESERVATION_SUCCESS,
  FETCH_RESERVATION_FAILURE,
} from "../Actions/ReservationActions";

// ------------------------------
// 🔹 Interfaces
// ------------------------------
export interface Reservation {
  id?: number;
  customerId?: number;
  tableId?: number;
  date?: string;
  time?: string;
  status?: string;
  totalPrice?: number;
  [key: string]: any;
}

export interface ReservationState {
  loading: boolean;
  reservations: Reservation[];
  error: string;
}

export interface ReservationAction {
  type: string;
  payload?: any;
}

// ------------------------------
// 🔹 Initial State
// ------------------------------
const initialState: ReservationState = {
  loading: false,
  reservations: [],
  error: "",
};

// ------------------------------
// 🔹 Reducer
// ------------------------------
const reservationReducer = (
  state = initialState,
  action: ReservationAction
): ReservationState => {
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
        reservations: Array.isArray(action.payload)
          ? action.payload
          : [],
        error: "",
      };

    case FETCH_RESERVATION_FAILURE:
      return {
        ...state,
        loading: false,
        reservations: [],
        error: action.payload,
      };

    default:
      return state;
  }
};

export default reservationReducer;
