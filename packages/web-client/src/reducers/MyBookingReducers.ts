import {
  FETCH_RESERVATIONS_REQUEST,
  FETCH_RESERVATIONS_SUCCESS,
  FETCH_RESERVATIONS_FAILURE,
  SET_CURRENT_PAGE,
} from "../Actions/MyBookingActions";

// ------------------------------
// 🔹 Interfaces
// ------------------------------
export interface Reservation {
  id?: number;
  tableId?: number;
  userId?: number;
  date?: string;
  time?: string;
  status?: string;
  [key: string]: any;
}

export interface MyBookingState {
  currentPage: number;
  pageSize: number;
  allReservation: Reservation[];
  loading: boolean;
  reservation: Reservation[];
  error: string;
  totalCount: number;
  totalPages: number;
}

export interface MyBookingAction {
  type: string;
  payload?: any;
}

// ------------------------------
// 🔹 Initial State
// ------------------------------
const initialState: MyBookingState = {
  currentPage: 1,
  pageSize: 5,
  allReservation: [],
  loading: false,
  reservation: [],
  error: "",
  totalCount: 0,
  totalPages: 0,
};

// ------------------------------
// 🔹 Reducer
// ------------------------------
const MyBookingReducer = (
  state = initialState,
  action: MyBookingAction
): MyBookingState => {
  switch (action.type) {
    case FETCH_RESERVATIONS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_RESERVATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        allReservation: action.payload.results,
        totalCount: action.payload.totalCount,
        totalPages: action.payload.totalPages,
        currentPage: action.payload.currentPage,
        reservation: action.payload.results.slice(0, state.pageSize),
      };

    case FETCH_RESERVATIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case SET_CURRENT_PAGE:
      const start = (action.payload - 1) * state.pageSize;
      const end = start + state.pageSize;
      return {
        ...state,
        currentPage: action.payload,
        reservation: state.allReservation.slice(start, end),
      };

    default:
      return state;
  }
};

export default MyBookingReducer;
