import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { API_ENDPOINT } from "../Config/APIs";
import AdminConfig from "../Config/index";
import http from "../Utils/Http";

// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_CATEGORY_PRODUCT_NOPAGE_REQUEST = 'FETCH_CATEGORY_PRODUCT_NOPAGE_REQUEST';
export const FETCH_CATEGORY_PRODUCT_NOPAGE_SUCCESS = 'FETCH_CATEGORY_PRODUCT_NOPAGE_SUCCESS';
export const FETCH_CATEGORY_PRODUCT_NOPAGE_FAILURE = 'FETCH_CATEGORY_PRODUCT_NOPAGE_FAILURE';

// ------------------------------
// 🔹 Interfaces
// ------------------------------
export interface CategoryProduct {
    id: number;
    name: string;
    [key: string]: any;
}

export interface CategoryProductNoPageState {
    loading: boolean;
    product_category: CategoryProduct[];
    error: string;
}

interface FetchCategoryProductNoPageRequestAction {
    type: typeof FETCH_CATEGORY_PRODUCT_NOPAGE_REQUEST;
}

interface FetchCategoryProductNoPageSuccessAction {
    type: typeof FETCH_CATEGORY_PRODUCT_NOPAGE_SUCCESS;
    payload: CategoryProduct[];
}

interface FetchCategoryProductNoPageFailureAction {
    type: typeof FETCH_CATEGORY_PRODUCT_NOPAGE_FAILURE;
    payload: string;
}

export type CategoryProductNoPageActions =
    | FetchCategoryProductNoPageRequestAction
    | FetchCategoryProductNoPageSuccessAction
    | FetchCategoryProductNoPageFailureAction;

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchCategoryProductNoPageRequest = (): FetchCategoryProductNoPageRequestAction => ({
    type: FETCH_CATEGORY_PRODUCT_NOPAGE_REQUEST
});

export const fetchCategoryProductNoPageSuccess = (product: CategoryProduct[]): FetchCategoryProductNoPageSuccessAction => ({
    type: FETCH_CATEGORY_PRODUCT_NOPAGE_SUCCESS,
    payload: product
});

export const fetchCategoryProductNoPageFailure = (error: string): FetchCategoryProductNoPageFailureAction => ({
    type: FETCH_CATEGORY_PRODUCT_NOPAGE_FAILURE,
    payload: error
});

// ------------------------------
// 🔹 Thunk Action
// ------------------------------
export const fetchCategoryProductNoPage = (): ThunkAction<void, CategoryProductNoPageState, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(fetchCategoryProductNoPageRequest());
        try {
            const response = await http.get(`${API_ENDPOINT}/${AdminConfig.routes.categoryProduct}/noPage`);
            const product_category: CategoryProduct[] = response.data.results;
            console.log("Fetched category products:", product_category);
            dispatch(fetchCategoryProductNoPageSuccess(product_category));
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to fetch categories";
            dispatch(fetchCategoryProductNoPageFailure(errorMsg));
        }
    };
};
