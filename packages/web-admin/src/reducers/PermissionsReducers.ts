import {
    FETCH_PERMISSIONS_REQUEST,
    FETCH_PERMISSIONS_SUCCESS,
    FETCH_PERMISSIONS_FAILURE,
    SET_CURRENT_PAGE
} from '../Actions/PermissionsActions';

const initialState = {
    allPermissions: [],
    permissions: [],
    currentPage: 1,
    pageSize: 5, // Thêm pageSize để phân trang
    loading: false,
    error: '',
    totalCount: 0, 
    totalPages: 0 
};

const permissionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PERMISSIONS_REQUEST:
            return {
                ...state,
                loading: true,
                error: ''
            };
        case FETCH_PERMISSIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                allPermissions: action.payload.results,
                totalCount: action.payload.totalCount,
                totalPages: action.payload.totalPages,
                currentPage: action.payload.currentPage,
                permissions: action.payload.results.slice(0, state.pageSize) // Dữ liệu cho trang đầu tiên
            };
        case FETCH_PERMISSIONS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case SET_CURRENT_PAGE: {
            const start = (action.payload - 1) * state.pageSize;
            const end = start + state.pageSize;
            return {
                ...state,
                currentPage: action.payload,
                permissions: state.allPermissions.slice(start, end) // Dữ liệu cho trang hiện tại
            };
        }
        default:
            return state;
    }
};

export default permissionsReducer;
