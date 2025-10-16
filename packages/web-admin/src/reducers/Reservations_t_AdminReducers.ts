import {
    FETCH_RESERVATIONS_REQUEST,
    FETCH_RESERVATIONS_SUCCESS,
    FETCH_RESERVATIONS_FAILURE,
    SET_CURRENT_PAGE,
    SET_LIMIT
} from '../Actions/Reservations_t_AdminActions';

const initialState = {
    allReservations: [],
    reservationsOnPage: [],
    loading: false,
    error: '',
    totalCount: 0,
    totalPages: 0,
    currentPage: parseInt(localStorage.getItem('currentPage'), 10) || 1,
    limit: localStorage.getItem('limit') ? parseInt(localStorage.getItem('limit')) : 10,
};

const Reservations_t_AdminReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_RESERVATIONS_REQUEST:
            return {
                ...state,
                loading: true,
                error: ''
            };
        case FETCH_RESERVATIONS_SUCCESS: {
            const { results = [], totalCount, totalPages, currentPage } = action.payload;

            localStorage.setItem('currentPage', currentPage);

            return {
                ...state,
                loading: false,
                allReservations: results,
                totalCount,
                totalPages,
                currentPage,
                reservationsOnPage: results.slice(0, state.limit),
            };
        }
        case FETCH_RESERVATIONS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case SET_CURRENT_PAGE: {
            const start = (action.payload - 1) * state.limit;
            const end = start + state.limit;

            localStorage.setItem('currentPage', action.payload);

            return {
                ...state,
                currentPage: action.payload,
                reservationsOnPage: state.allReservations.slice(start, end),
            };
        }
        case SET_LIMIT: {
            const newLimit = action.payload;
            const totalPages = Math.ceil(state.allReservations.length / newLimit);
            const currentPage = state.currentPage > totalPages ? totalPages : state.currentPage;

            const start = (currentPage - 1) * newLimit;
            const end = start + newLimit;

            localStorage.setItem('limit', newLimit);

            return {
                ...state,
                limit: newLimit,
                currentPage,
                reservationsOnPage: state.allReservations.slice(start, end),
            };
        }
        default:
            return state;
    }
};

export default Reservations_t_AdminReducer;
