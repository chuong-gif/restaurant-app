import type { ThunkAction, ThunkDispatch } from "redux-thunk";
import type { AnyAction } from "redux";
import { API_ENDPOINT, API_DATA } from "../configs/APIs";
import http from "../Utils/Http";

// ------------------------------
// 🔹 Kiểu dữ liệu sản phẩm
// ------------------------------
export interface Product {
    id: string;
    name: string;
    price?: number;
    status?: string;
    [key: string]: any;
}

// ------------------------------
// 🔹 Kiểu RootState (tùy theo project bạn có thể import từ store)
// ------------------------------
export interface RootState {
    product: Product[];
    loading?: boolean;
    error?: string | null;
}

// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_PRODUCT_REQUEST = "FETCH_PRODUCT_REQUEST";
export const FETCH_PRODUCT_SUCCESS = "FETCH_PRODUCT_SUCCESS";
export const FETCH_PRODUCT_FAILURE = "FETCH_PRODUCT_FAILURE";

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchProductRequest = () => ({
    type: FETCH_PRODUCT_REQUEST as typeof FETCH_PRODUCT_REQUEST,
});

export const fetchProductSuccess = (product: Product[]) => ({
    type: FETCH_PRODUCT_SUCCESS as typeof FETCH_PRODUCT_SUCCESS,
    payload: product,
});

export const fetchProductFailure = (error: string) => ({
    type: FETCH_PRODUCT_FAILURE as typeof FETCH_PRODUCT_FAILURE,
    payload: error,
});

// ------------------------------
// 🔹 Thunk Action (kiểu TypeScript đầy đủ)
// ------------------------------
type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    AnyAction
>;

type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

// ------------------------------
// 🔹 Lấy toàn bộ sản phẩm
// ------------------------------
export const fetchProduct = (): AppThunk => {
    return async (dispatch: AppDispatch) => {
        dispatch(fetchProductRequest());
        try {
            const response = await http.get(`${API_ENDPOINT}/${API_DATA.product}`);
            const product: Product[] = response.data.results;
            dispatch(fetchProductSuccess(product));
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message;
            dispatch(fetchProductFailure(errorMsg));
        }
    };
};

// ------------------------------
// 🔹 Lấy sản phẩm đang hoạt động
// ------------------------------
export const fetchProductHoatDong = (): AppThunk => {
    return async (dispatch: AppDispatch) => {
        dispatch(fetchProductRequest());
        try {
            const response = await http.get(`${API_ENDPOINT}/${API_DATA.product}/hoat_dong`);
            const product: Product[] = response.data.results;
            dispatch(fetchProductSuccess(product));
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message;
            dispatch(fetchProductFailure(errorMsg));
        }
    };
};

// ------------------------------
// 🔹 Lấy sản phẩm mới
// ------------------------------
export const fetchProductWithNewDate = (): AppThunk => {
    return async (dispatch: AppDispatch) => {
        dispatch(fetchProductRequest());
        try {
            const response = await http.get(`${API_ENDPOINT}/${API_DATA.product}/new`);
            const product: Product[] = response.data.results;
            dispatch(fetchProductSuccess(product));
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message;
            dispatch(fetchProductFailure(errorMsg));
        }
    };
};

// ------------------------------
// 🔹 Lấy menu sản phẩm
// ------------------------------
export const fetchMenu = (): AppThunk => {
    return async (dispatch: AppDispatch) => {
        dispatch(fetchProductRequest());
        try {
            const response = await http.get(`${API_ENDPOINT}/${API_DATA.product}/menu`);
            const product: Product[] = response.data.results;
            dispatch(fetchProductSuccess(product));
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message;
            dispatch(fetchProductFailure(errorMsg));
        }
    };
};
