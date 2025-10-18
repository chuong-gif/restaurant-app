import {
    FETCH_ROLEPERMISSIONS_REQUEST,
    FETCH_ROLEPERMISSIONS_SUCCESS,
    FETCH_ROLEPERMISSIONS_FAILURE,
} from '../action/RolePermissionsActions';

// Kiểu cho action
interface RolePermissionsAction {
    type: string;
    payload?: any;
}

// Kiểu cho state
interface RolePermissionsState {
    allRolePermissions: any[]; // Danh sách tất cả quyền của vai trò
    rolePermissions: any[];    // Danh sách quyền của vai trò hiện tại
    loading: boolean;
    error: string;
}

const initialState: RolePermissionsState = {
    allRolePermissions: [],
    rolePermissions: [],
    loading: false,
    error: '',
};

const RolePermissionsReducer = (
    state: RolePermissionsState = initialState,
    action: RolePermissionsAction
): RolePermissionsState => {
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
                allRolePermissions: Array.isArray(action.payload.results)
                    ? action.payload.results
                    : [],
                rolePermissions: Array.isArray(action.payload.results)
                    ? action.payload.results
                    : [],
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
