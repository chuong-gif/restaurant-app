import {
    FETCH_PRODUCT_FAILURE,
    FETCH_PRODUCT_REQUEST,
    FETCH_PRODUCT_SUCCESS,
    SET_CURRENT_PAGE,
    SET_LIMIT
} from '../action/ProductActions';

// Kiểu cho action
interface ProductAction {
    type: string;
    payload?: any;
}

// Kiểu cho state
interface ProductState {
    allProducts: any[];
    productsOnPage: any[];
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

const initialState: ProductState = {
    allProducts: [],
    productsOnPage: [],
    loading: false,
    error: '',
    totalCount: 0,
    totalPages: 0,
    currentPage: storedPage !== null ? parseInt(storedPage, 10) : 1,
    limit: storedLimit !== null ? parseInt(storedLimit, 10) : 10,
};

const productReducer = (
    state: ProductState = initialState,
    action: ProductAction
): ProductState => {
    switch (action.type) {
        case FETCH_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
                error: ''
            };
        case FETCH_PRODUCT_SUCCESS: {
            const { results = [], totalCount, totalPages, currentPage } = action.payload;

            localStorage.setItem('currentPage', currentPage.toString());

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

            localStorage.setItem('currentPage', action.payload.toString());

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

            localStorage.setItem('limit', newLimit.toString());

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
