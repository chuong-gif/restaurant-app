import {
    FETCH_EMPLOYEE_FAILURE,
    FETCH_EMPLOYEE_REQUEST,
    FETCH_EMPLOYEE_SUCCESS,
    SET_CURRENT_PAGE
} from '../Actions/EmployeeActions';

const initialState = {
    allEmployees: [],
    employee: [],
    currentPage: parseInt(localStorage.getItem("currentPage"), 10) || 1,
    pageSize: 5, // Số lượng nhân viên trên mỗi trang
    loading: false,
    error: '',
    totalCount: 0, // Tổng số nhân viên
    totalPages: 0 // Tổng số trang
};

const employeeReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_EMPLOYEE_REQUEST:
            return {
                ...state,
                loading: true
            };

        case FETCH_EMPLOYEE_SUCCESS: {
            const { results, totalCount, totalPages, currentPage } = action.payload;

            // Lưu trang hiện tại vào localStorage
            localStorage.setItem("currentPage", currentPage);

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
            localStorage.setItem("currentPage", action.payload);

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
