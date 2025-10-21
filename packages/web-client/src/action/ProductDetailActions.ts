import axios, { AxiosError, type AxiosResponse } from "axios";
import type { ThunkAction, ThunkDispatch } from "redux-thunk";
import type { AnyAction } from "redux";
import { API_ENDPOINT, API_DATA } from "../configs/APIs";

// ------------------------------
// 🔹 Kiểu dữ liệu sản phẩm chi tiết
// ------------------------------
export interface ProductDetail {
    id: string;
    name: string;
    price?: number;
    description?: string;
    categoryId?: string;
    slug?: string;
    image?: string;
    [key: string]: any;
}

// ------------------------------
// 🔹 Kiểu RootState (có thể import từ store nếu có)
// ------------------------------
export interface RootState {
    productDetail: ProductDetail | null;
    loading?: boolean;
    error?: string | null;
}

// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_PRODUCT_DETAIL_REQUEST = "FETCH_PRODUCT_DETAIL_REQUEST";
export const FETCH_PRODUCT_DETAIL_SUCCESS = "FETCH_PRODUCT_DETAIL_SUCCESS";
export const FETCH_PRODUCT_DETAIL_FAILURE = "FETCH_PRODUCT_DETAIL_FAILURE";

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchProductDetailRequest = () => ({
    type: FETCH_PRODUCT_DETAIL_REQUEST as typeof FETCH_PRODUCT_DETAIL_REQUEST,
});

export const fetchProductDetailSuccess = (productDetail: ProductDetail) => ({
    type: FETCH_PRODUCT_DETAIL_SUCCESS as typeof FETCH_PRODUCT_DETAIL_SUCCESS,
    payload: productDetail,
});

export const fetchProductDetailFailure = (error: string) => ({
    type: FETCH_PRODUCT_DETAIL_FAILURE as typeof FETCH_PRODUCT_DETAIL_FAILURE,
    payload: error,
});

// ------------------------------
// 🔹 Định nghĩa kiểu cho Redux Thunk
// ------------------------------
type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    AnyAction
>;

type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

// ------------------------------
// 🔹 Fetch product detail by ID
// ------------------------------
export const fetchProductDetail = (productId: string): AppThunk => {
    return async (dispatch: AppDispatch) => {
        dispatch(fetchProductDetailRequest());
        try {
            const response: AxiosResponse<{ data: ProductDetail }> = await axios.get(
                `${API_ENDPOINT}/${API_DATA.product}/${productId}`
            );
            const productDetail: ProductDetail = response.data.data;
            dispatch(fetchProductDetailSuccess(productDetail));
        } catch (error: unknown) {
            const err = error as AxiosError<{ message?: string }>;
            const errorMsg = err.response?.data?.message || err.message || "Lỗi khi gọi API";
            dispatch(fetchProductDetailFailure(errorMsg));
        }
    };
};

// ------------------------------
// 🔹 Fetch product detail by Slug
// ------------------------------
export const fetchProductDetailBySlug = (slug: string): AppThunk => {
    return async (dispatch: AppDispatch) => {
        dispatch(fetchProductDetailRequest());
        try {
            const response: AxiosResponse<{ data: ProductDetail }> = await axios.get(
                `${API_ENDPOINT}/${API_DATA.product}/slug/${slug}`
            );
            const productDetail: ProductDetail = response.data.data;
            dispatch(fetchProductDetailSuccess(productDetail));
        } catch (error: unknown) {
            const err = error as AxiosError<{ message?: string }>;
            const errorMsg = err.response?.data?.message || err.message || "Lỗi khi gọi API";
            dispatch(fetchProductDetailFailure(errorMsg));
        }
    };
};
