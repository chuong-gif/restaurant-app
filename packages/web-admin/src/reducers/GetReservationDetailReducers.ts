import {
    FETCH_RESERVATIONDETAIL_REQUEST,
    FETCH_RESERVATIONDETAIL_SUCCESS,
    FETCH_RESERVATIONDETAIL_FAILURE
} from '../action/GetReservationDetailAction';

// Kiểu cho action
interface ReservationDetailAction {
    type: string;
    payload?: any;
}

// Kiểu cho state
interface ReservationDetailState {
    loading: boolean;
    reservationDetail: any[];
    error: string;
}

const initialState: ReservationDetailState = {
    loading: false,
    reservationDetail: [],
    error: ''
};

const ReservationDetailReducer = (
    state: ReservationDetailState = initialState,
    action: ReservationDetailAction
): ReservationDetailState => {
    switch (action.type) {
        case FETCH_RESERVATIONDETAIL_REQUEST:
            return {
                ...state,
                loading: true,
                error: ''
            };
        case FETCH_RESERVATIONDETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                reservationDetail: Array.isArray(action.payload) ? action.payload : [],
                error: ''
            };
        case FETCH_RESERVATIONDETAIL_FAILURE:
            return {
                ...state,
                loading: false,
                reservationDetail: [],
                error: action.payload
            };
        default:
            return state;
    }
};

export default ReservationDetailReducer;
