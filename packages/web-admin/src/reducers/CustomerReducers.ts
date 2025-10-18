import {
    FETCH_CUSTOMER_FAILURE,
    FETCH_CUSTOMER_REQUEST,
    FETCH_CUSTOMER_SUCCESS,
    SET_CURRENT_PAGE
} from '../action/CustomerActions';

// Định nghĩa kiểu cho action
interface CustomerAction {
    type: string;
    payload?: any;
}

// Định nghĩa kiểu cho state
interface CustomerState {
    allCustomers: any[];
    customer: any[];
    currentPage: number;
    pageSize: number;
    loading: boolean;
    error: string;
    totalCount: number;
    totalPages: number;
}

// Xử lý localStorage trả về null
const storedPage = localStorage.getItem("currentPage");
const initialPage = storedPage !== null ? parseInt(storedPage, 10) : 1;

const initialState: CustomerState = {
    allCustomers: [],
    customer: [],
    currentPage: initialPage,
    pageSize: 5,
    loading: false,
    error: '',
    totalCount: 0, // Tổng số khách hàng
    totalPages: 0 // Tổng số trang
};

const customerReducer = (state: CustomerState = initialState, action: CustomerAction): CustomerState => {
    switch (action.type) {
        case FETCH_CUSTOMER_REQUEST:
            return {
                ...state,
                loading: true
            };

        case FETCH_CUSTOMER_SUCCESS: {
            const { results, totalCount, totalPages, currentPage } = action.payload;

            // Lưu thông tin currentPage vào localStorage
            localStorage.setItem("currentPage", currentPage.toString());

            return {
                ...state,
                loading: false,
                allCustomers: Array.isArray(results) ? results : [],
                totalCount,
                totalPages,
                currentPage,
                customer: Array.isArray(results) ? results.slice(0, state.pageSize) : []
            };
        }

        case FETCH_CUSTOMER_FAILURE:
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
                customer: state.allCustomers.slice(start, end)
            };
        }

        default:
            return state;
    }
};

export default customerReducer;
