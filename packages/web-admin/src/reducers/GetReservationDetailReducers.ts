import {
    FETCH_RESERVATIONDETAIL_REQUEST,
    FETCH_RESERVATIONDETAIL_SUCCESS,
    FETCH_RESERVATIONDETAIL_FAILURE
} from '../Actions/GetReservationDetailAction';

const initialState = {
    loading: false,
    reservationDetail: [],
    error: ''
};

const ReservationDetailReducer = (state = initialState, action) => {
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
