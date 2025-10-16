import {
    FETCH_USERS_REQUEST,
    FETCH_USERS_SUCCESS,
    FETCH_USERS_FAILURE,
    SET_CURRENT_PAGE,
    SET_LIMIT
} from '../Actions/UsersAction';

const initialState = {
    allUsers: [], // Lưu tất cả người dùng
    user: [],     // Danh sách người dùng trên trang hiện tại
    currentPage: parseInt(localStorage.getItem('currentPage'), 10) || 1,
    limit: localStorage.getItem('limit') ? parseInt(localStorage.getItem('limit')) : 10,
    loading: false,
    error: '',
    totalCount: 0,
    totalPages: 0
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USERS_REQUEST:
            return {
                ...state,
                loading: true
            };

        case FETCH_USERS_SUCCESS: {
            const { results = [], totalCount = 0, totalPages = 0, currentPage = 1 } = action.payload || {};
            localStorage.setItem('currentPage', currentPage);
            return {
                ...state,
                loading: false,
                allUsers: Array.isArray(results) ? results : [],
                totalCount,
                totalPages,
                currentPage,
                user: Array.isArray(results) ? results.slice(0, state.limit) : [],
            };
        }

        case FETCH_USERS_FAILURE:
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
                user: state.allUsers.slice(start, end)
            };
        }

        case SET_LIMIT: {
            const newLimit = action.payload;
            const totalPages = Math.ceil(state.allUsers.length / newLimit) || 1;
            const currentPage = state.currentPage > totalPages ? totalPages : state.currentPage;
            const start = (currentPage - 1) * newLimit;
            const end = start + newLimit;
            localStorage.setItem('limit', newLimit);
            return {
                ...state,
                limit: newLimit,
                currentPage,
                user: state.allUsers.slice(start, end)
            };
        }

        default:
            return state;
    }
};

export default userReducer;
