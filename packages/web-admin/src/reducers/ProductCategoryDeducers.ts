import {
    FETCH_PRODUCT_CATEGORY_REQUEST,
    FETCH_PRODUCT_CATEGORY_SUCCESS,
    FETCH_PRODUCT_CATEGORY_FAILURE,
    SET_CURRENT_PAGE,
    SET_LIMIT
} from '../action/ProductCategoryActions';

// Kiểu cho action
interface ProductCategoryAction {
    type: string;
    payload?: any;
}

// Kiểu cho state
interface ProductCategoryState {
    allProductCategories: any[];
    product_category: any[];
    loading: boolean;
    error: string;
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

// Xử lý localStorage trả về null
const storedPage = localStorage.getItem('currentPage');
const storedLimit = localStorage.getItem('limit');

const initialState: ProductCategoryState = {
    allProductCategories: [],
    product_category: [],
    loading: false,
    error: '',
    totalCount: 0,
    totalPages: 0,
    currentPage: storedPage !== null ? parseInt(storedPage, 10) : 1,
    limit: storedLimit !== null ? parseInt(storedLimit, 10) : 10,
};

const productCategoryReducer = (
    state: ProductCategoryState = initialState,
    action: ProductCategoryAction
): ProductCategoryState => {
    switch (action.type) {
        case FETCH_PRODUCT_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true,
                error: ''
            };
        case FETCH_PRODUCT_CATEGORY_SUCCESS: {
            const { results = [], totalCount, totalPages, currentPage } = action.payload;

            localStorage.setItem('currentPage', currentPage.toString());

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

            localStorage.setItem('currentPage', action.payload.toString());

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

            localStorage.setItem('limit', newLimit.toString());

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
