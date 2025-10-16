import {
    FETCH_ROLEPERMISSIONS_REQUEST,
    FETCH_ROLEPERMISSIONS_SUCCESS,
    FETCH_ROLEPERMISSIONS_FAILURE,
} from '../Actions/RolePermissionsActions';

const initialState = {
    allRolePermissions: [], // Danh sách tất cả quyền của vai trò
    rolePermissions: [],    // Danh sách quyền của vai trò hiện tại
    loading: false,
    error: '',
};

const RolePermissionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ROLEPERMISSIONS_REQUEST:
            return {
                ...state,
                loading: true,
                error: '', // Reset error khi bắt đầu request
            };
        case FETCH_ROLEPERMISSIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                allRolePermissions: Array.isArray(action.payload.results) ? action.payload.results : [],
                rolePermissions: Array.isArray(action.payload.results) ? action.payload.results : [],
            };
        case FETCH_ROLEPERMISSIONS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default RolePermissionsReducer;
