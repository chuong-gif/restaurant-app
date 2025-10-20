import {
    FETCH_PERMISSIONS_REQUEST,
    FETCH_PERMISSIONS_SUCCESS,
    FETCH_PERMISSIONS_FAILURE,
    SET_CURRENT_PAGE
} from '../action/PermissionsActions';

// Kiểu cho action
interface PermissionsAction {
    type: string;
    payload?: any;
}

// Kiểu cho state
interface PermissionsState {
    allPermissions: any[];
    permissions: any[];
    currentPage: number;
    pageSize: number;
    loading: boolean;
    error: string;
    totalCount: number;
    totalPages: number;
}

const initialState: PermissionsState = {
    allPermissions: [],
    permissions: [],
    currentPage: 1,
    pageSize: 5, // Số lượng phân trang
    loading: false,
    error: '',
    totalCount: 0, 
    totalPages: 0 
};

const permissionsReducer = (
    state: PermissionsState = initialState, 
    action: PermissionsAction
): PermissionsState => {
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
                allPermissions: Array.isArray(action.payload.results) ? action.payload.results : [],
                totalCount: action.payload.totalCount,
                totalPages: action.payload.totalPages,
                currentPage: action.payload.currentPage,
                permissions: Array.isArray(action.payload.results)
                    ? action.payload.results.slice(0, state.pageSize)
                    : []
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
                permissions: state.allPermissions.slice(start, end)
            };
        }
        default:
            return state;
    }
};

export default permissionsReducer;
