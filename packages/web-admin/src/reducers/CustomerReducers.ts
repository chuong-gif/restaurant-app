import {
    FETCH_CUSTOMER_FAILURE,
    FETCH_CUSTOMER_REQUEST,
    FETCH_CUSTOMER_SUCCESS,
    SET_CURRENT_PAGE
} from '../Actions/CustomerActions';

const initialState = {
    allCustomers: [],
    customer: [],
    currentPage: parseInt(localStorage.getItem("currentPage"), 10) || 1,
    pageSize: 5,
    loading: false,
    error: '',
    totalCount: 0, // Tổng số khách hàng
    totalPages: 0 // Tổng số trang
};

const customerReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CUSTOMER_REQUEST:
            return {
                ...state,
                loading: true
            };

        case FETCH_CUSTOMER_SUCCESS: {
            const { results, totalCount, totalPages, currentPage } = action.payload;

            // Lưu thông tin currentPage vào localStorage
            localStorage.setItem("currentPage", currentPage);

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
            localStorage.setItem("currentPage", action.payload);

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
