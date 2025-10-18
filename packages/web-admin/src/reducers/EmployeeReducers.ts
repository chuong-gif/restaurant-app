import {
    FETCH_EMPLOYEE_FAILURE,
    FETCH_EMPLOYEE_REQUEST,
    FETCH_EMPLOYEE_SUCCESS,
    SET_CURRENT_PAGE
} from '../action/EmployeeActions';

// Kiểu cho action
interface EmployeeAction {
    type: string;
    payload?: any;
}

// Kiểu cho state
interface EmployeeState {
    allEmployees: any[];
    employee: any[];
    currentPage: number;
    pageSize: number;
    loading: boolean;
    error: string;
    totalCount: number;
    totalPages: number;
}

// Kiểm tra giá trị từ localStorage
const storedPage = localStorage.getItem("currentPage");
const initialPage = storedPage !== null ? parseInt(storedPage, 10) : 1;

const initialState: EmployeeState = {
    allEmployees: [],
    employee: [],
    currentPage: initialPage,
    pageSize: 5, // Số lượng nhân viên trên mỗi trang
    loading: false,
    error: '',
    totalCount: 0,
    totalPages: 0
};

const employeeReducer = (state: EmployeeState = initialState, action: EmployeeAction): EmployeeState => {
    switch (action.type) {
        case FETCH_EMPLOYEE_REQUEST:
            return {
                ...state,
                loading: true
            };

        case FETCH_EMPLOYEE_SUCCESS: {
            const { results, totalCount, totalPages, currentPage } = action.payload;

            // Lưu trang hiện tại vào localStorage
            localStorage.setItem("currentPage", currentPage.toString());

            return {
                ...state,
                loading: false,
                allEmployees: Array.isArray(results) ? results : [],
                totalCount,
                totalPages,
                currentPage,
                employee: Array.isArray(results) ? results.slice(0, state.pageSize) : []
            };
        }

        case FETCH_EMPLOYEE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case SET_CURRENT_PAGE: {
            const start = (action.payload - 1) * state.pageSize;
            const end = start + state.pageSize;

            // Lưu trang hiện tại vào localStorage
            localStorage.setItem("currentPage", action.payload.toString());

            return {
                ...state,
                currentPage: action.payload,
                employee: state.allEmployees.slice(start, end)
            };
        }

        default:
            return state;
    }
};

export default employeeReducer;
