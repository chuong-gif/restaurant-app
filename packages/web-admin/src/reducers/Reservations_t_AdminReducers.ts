import {
    FETCH_RESERVATIONS_REQUEST,
    FETCH_RESERVATIONS_SUCCESS,
    FETCH_RESERVATIONS_FAILURE,
    SET_CURRENT_PAGE,
    SET_LIMIT
} from '../action/Reservations_t_AdminActions';

// Kiểu cho action
interface ReservationsAction {
    type: string;
    payload?: any;
}

// Kiểu cho state
interface ReservationsState {
    allReservations: any[];
    reservationsOnPage: any[];
    loading: boolean;
    error: string;
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

// Xử lý localStorage trả về null
const storedPage = localStorage.getItem('currentPage');
const storedLimit = localStorage.getItem('limit');

const initialState: ReservationsState = {
    allReservations: [],
    reservationsOnPage: [],
    loading: false,
    error: '',
    totalCount: 0,
    totalPages: 0,
    currentPage: storedPage !== null ? parseInt(storedPage, 10) : 1,
    limit: storedLimit !== null ? parseInt(storedLimit, 10) : 10,
};

const Reservations_t_AdminReducer = (
    state: ReservationsState = initialState,
    action: ReservationsAction
): ReservationsState => {
    switch (action.type) {
        case FETCH_RESERVATIONS_REQUEST:
            return {
                ...state,
                loading: true,
                error: ''
            };
        case FETCH_RESERVATIONS_SUCCESS: {
            const { results = [], totalCount, totalPages, currentPage } = action.payload;

            localStorage.setItem('currentPage', currentPage.toString());

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

            localStorage.setItem('currentPage', action.payload.toString());

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

            localStorage.setItem('limit', newLimit.toString());

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
