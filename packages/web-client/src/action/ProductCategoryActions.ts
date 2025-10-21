import type { ThunkAction, ThunkDispatch } from "redux-thunk";
import type { AnyAction } from "redux";
import { API_ENDPOINT, API_DATA } from "../configs/APIs";
import http from "../Utils/Http";

// ------------------------------
// 🔹 Kiểu dữ liệu danh mục sản phẩm
// ------------------------------
export interface ProductCategory {
    id: string;
    name: string;
    status?: string;
    description?: string;
    [key: string]: any;
}

// ------------------------------
// 🔹 Kiểu RootState (tạm thời, bạn có thể import từ store/index.ts nếu có sẵn)
// ------------------------------
export interface RootState {
    productCategory: ProductCategory[];
    loading?: boolean;
    error?: string | null;
}

// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_PRODUCT_CATEGORY_REQUEST = "FETCH_PRODUCT_CATEGORY_REQUEST";
export const FETCH_PRODUCT_CATEGORY_SUCCESS = "FETCH_PRODUCT_CATEGORY_SUCCESS";
export const FETCH_PRODUCT_CATEGORY_FAILURE = "FETCH_PRODUCT_CATEGORY_FAILURE";

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchProductCategoryRequest = () => ({
    type: FETCH_PRODUCT_CATEGORY_REQUEST as typeof FETCH_PRODUCT_CATEGORY_REQUEST,
});

export const fetchProductCategorySuccess = (product_category: ProductCategory[]) => ({
    type: FETCH_PRODUCT_CATEGORY_SUCCESS as typeof FETCH_PRODUCT_CATEGORY_SUCCESS,
    payload: product_category,
});

export const fetchProductCategoryFailure = (error: string) => ({
    type: FETCH_PRODUCT_CATEGORY_FAILURE as typeof FETCH_PRODUCT_CATEGORY_FAILURE,
    payload: error,
});

// ------------------------------
// 🔹 Định nghĩa kiểu Thunk cho TypeScript
// ------------------------------
type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    AnyAction
>;

type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

// ------------------------------
// 🔹 Lấy tất cả danh mục sản phẩm
// ------------------------------
export const fetchProductCategory = (): AppThunk => {
    return async (dispatch: AppDispatch) => {
        dispatch(fetchProductCategoryRequest());
        try {
            const response = await http.get(`${API_ENDPOINT}/${API_DATA.categoryProduct}`);
            const product_category: ProductCategory[] = response.data.results;
            dispatch(fetchProductCategorySuccess(product_category));
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message;
            dispatch(fetchProductCategoryFailure(errorMsg));
        }
    };
};

// ------------------------------
// 🔹 Lấy danh mục sản phẩm đang hoạt động
// ------------------------------
export const fetchProductCategoryHoatDong = (): AppThunk => {
    return async (dispatch: AppDispatch) => {
        dispatch(fetchProductCategoryRequest());
        try {
            const response = await http.get(`${API_ENDPOINT}/${API_DATA.categoryProduct}/hoat_dong`);
            const product_category: ProductCategory[] = response.data.results;
            dispatch(fetchProductCategorySuccess(product_category));
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message;
            dispatch(fetchProductCategoryFailure(errorMsg));
        }
    };
};

// ------------------------------
// 🔹 Lấy danh sách danh mục (cho dropdown/menu)
// ------------------------------
export const fetchListProductCategory = (): AppThunk => {
    return async (dispatch: AppDispatch) => {
        dispatch(fetchProductCategoryRequest());
        try {
            const response = await http.get(`${API_ENDPOINT}/${API_DATA.categoryProduct}/danh_muc`);
            const product_category: ProductCategory[] = response.data.results;
            dispatch(fetchProductCategorySuccess(product_category));
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message;
            dispatch(fetchProductCategoryFailure(errorMsg));
        }
    };
};
