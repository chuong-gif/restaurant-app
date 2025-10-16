import {
    FETCH_PRODUCT_CATEGORY_REQUEST,
    FETCH_PRODUCT_CATEGORY_SUCCESS,
    FETCH_PRODUCT_CATEGORY_FAILURE,
    SET_CURRENT_PAGE,
    SET_LIMIT
} from '../Actions/ProductCategoryActions';

const initialState = {
    allProductCategories: [],
    loading: false,
    product_category: [],
    error: '',
    totalCount: 0,
    totalPages: 0,
    currentPage: parseInt(localStorage.getItem('currentPage'), 10) || 1,
    limit: localStorage.getItem('limit') ? parseInt(localStorage.getItem('limit')) : 10,
};

const productCategoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PRODUCT_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true,
                error: ''
            };
        case FETCH_PRODUCT_CATEGORY_SUCCESS: {
            const { results = [], totalCount, totalPages, currentPage } = action.payload;

            localStorage.setItem('currentPage', currentPage);

            return {
                ...state,
                loading: false,
                allProductCategories: results,
                totalCount,
                totalPages,
                currentPage,
                product_category: results.slice(0, state.limit),
            };
        }
        case FETCH_PRODUCT_CATEGORY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case SET_CURRENT_PAGE: {
            const start = (action.payload - 1) * state.limit;
            const end = start + state.limit;

            localStorage.setItem('currentPage', action.payload);

            return {
                ...state,
                currentPage: action.payload,
                product_category: state.allProductCategories.slice(start, end),
            };
        }
        case SET_LIMIT: {
            const newLimit = action.payload;
            const totalPages = Math.ceil(state.allProductCategories.length / newLimit);
            const currentPage = state.currentPage > totalPages ? totalPages : state.currentPage;

            const start = (currentPage - 1) * newLimit;
            const end = start + newLimit;

            localStorage.setItem('limit', newLimit);

            return {
                ...state,
                limit: newLimit,
                currentPage,
                product_category: state.allProductCategories.slice(start, end),
            };
        }
        default:
            return state;
    }
};

export default productCategoryReducer;
