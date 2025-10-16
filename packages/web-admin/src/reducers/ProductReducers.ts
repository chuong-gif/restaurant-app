import {
    FETCH_PRODUCT_FAILURE,
    FETCH_PRODUCT_REQUEST,
    FETCH_PRODUCT_SUCCESS,
    SET_CURRENT_PAGE,
    SET_LIMIT
} from '../Actions/ProductActions';

const initialState = {
    allProducts: [],
    productsOnPage: [],
    loading: false,
    error: '',
    totalCount: 0,
    totalPages: 0,
    currentPage: parseInt(localStorage.getItem('currentPage'), 10) || 1,
    limit: localStorage.getItem('limit') ? parseInt(localStorage.getItem('limit')) : 10,
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
                error: ''
            };
        case FETCH_PRODUCT_SUCCESS: {
            const { results = [], totalCount, totalPages, currentPage } = action.payload;

            localStorage.setItem('currentPage', currentPage);

            return {
                ...state,
                loading: false,
                allProducts: results,
                totalCount,
                totalPages,
                currentPage,
                productsOnPage: results.slice(0, state.limit),
            };
        }
        case FETCH_PRODUCT_FAILURE:
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
                productsOnPage: state.allProducts.slice(start, end)
            };
        }
        case SET_LIMIT: {
            const newLimit = action.payload;
            const totalPages = Math.ceil(state.allProducts.length / newLimit);
            const currentPage = state.currentPage > totalPages ? totalPages : state.currentPage;

            const start = (currentPage - 1) * newLimit;
            const end = start + newLimit;

            localStorage.setItem('limit', newLimit);

            return {
                ...state,
                limit: newLimit,
                currentPage,
                productsOnPage: state.allProducts.slice(start, end)
            };
        }
        default:
            return state;
    }
};

export default productReducer;
