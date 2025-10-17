import { API_ENDPOINT } from "../configs/client/APIs";
import AdminConfig from "../configs/client/index";
import http from "../Utils/Http";
import type { AxiosError } from "axios";
import type { AnyAction } from "redux";
import type { ThunkDispatch } from "redux-thunk";

// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_PRODUCT_CATEGORY_REQUEST = "FETCH_PRODUCT_CATEGORY_REQUEST";
export const FETCH_PRODUCT_CATEGORY_SUCCESS = "FETCH_PRODUCT_CATEGORY_SUCCESS";
export const FETCH_PRODUCT_CATEGORY_FAILURE = "FETCH_PRODUCT_CATEGORY_FAILURE";
export const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";
export const SET_LIMIT = "SET_LIMIT";

// ------------------------------
// 🔹 Types (tạm dùng any cho kết quả nếu chưa có interface cụ thể)
// ------------------------------
export type ProductCategoryItem = any; // bạn có thể thay bằng interface chính xác
export type ProductCategoryResults = ProductCategoryItem[];

// ------------------------------
// 🔹 Dispatch type cho thunk
// ------------------------------
// Nếu bạn có RootState, thay `any` bằng RootState thay vì `any`.
export type AppDispatch = ThunkDispatch<any, any, AnyAction>;

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchProductCategoryRequest = () => ({
  type: FETCH_PRODUCT_CATEGORY_REQUEST,
});

export const fetchProductCategorySuccess = (
  results: ProductCategoryResults,
  totalCount: number = 0,
  totalPages: number = 0,
  currentPage: number = 1
) => ({
  type: FETCH_PRODUCT_CATEGORY_SUCCESS,
  payload: { results, totalCount, totalPages, currentPage },
});

export const fetchProductCategoryFailure = (error: string) => ({
  type: FETCH_PRODUCT_CATEGORY_FAILURE,
  payload: error,
});

export const setCurrentPage = (page: number) => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});

export const setLimit = (limit: number) => ({
  type: SET_LIMIT,
  payload: limit,
});

// ------------------------------
// 🔹 Thunks
// ------------------------------

// Hàm chung để fetch category
const fetchCategory = (
  endpoint: string = "",
  name: string = "",
  status: string = "",
  page: number = 1,
  pageSize: number = 10
) => {
  return async (dispatch: AppDispatch) => {
    dispatch(fetchProductCategoryRequest());
    try {
      const limitStr = localStorage.getItem("limit");
      const limit = parseInt(limitStr ?? String(pageSize), 10);

      const url = new URL(
        `${API_ENDPOINT}/${AdminConfig.routes.categoryProduct}${
          endpoint ? "/" + endpoint : ""
        }`
      );

      if (name) url.searchParams.append("search", name);
      if (status) url.searchParams.append("searchStatus", status);
      url.searchParams.append("page", String(page));
      url.searchParams.append("limit", String(limit));

      const response = await http.get(url.toString());
      const { results, totalCount, totalPages, currentPage } = response.data;
      dispatch(
        fetchProductCategorySuccess(results as ProductCategoryResults, totalCount, totalPages, currentPage)
      );
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      dispatch(
        fetchProductCategoryFailure(
          error.response?.data?.message || error.message || "Unknown error"
        )
      );
    }
  };
};

// Fetch tất cả category
export const fetchProductCategory = (
  name: string = "",
  status: string = "",
  page: number = 1,
  pageSize: number = 10
) => fetchCategory("", name, status, page, pageSize);

// Fetch category hoạt động
export const fetchProductCategoryHoatDong = (
  name: string = "",
  page: number = 1,
  pageSize: number = 10
) => fetchCategory("hoat_dong", name, "", page, pageSize);

// Fetch danh sách category không phân trang (danh_muc)
export const fetchListProductCategory = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(fetchProductCategoryRequest());
    try {
      const response = await http.get(
        `${API_ENDPOINT}/${AdminConfig.routes.categoryProduct}/danh_muc`
      );
      dispatch(fetchProductCategorySuccess(response.data.results));
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      dispatch(
        fetchProductCategoryFailure(
          error.response?.data?.message || error.message || "Unknown error"
        )
      );
    }
  };
};

// Add category
export const addProductCategory = (product: any) => {
  return async (dispatch: AppDispatch) => {
    dispatch(fetchProductCategoryRequest());
    try {
      await http.post(`${API_ENDPOINT}/${AdminConfig.routes.categoryProduct}`, product);
      dispatch(fetchProductCategory()); // reload danh mục
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      dispatch(
        fetchProductCategoryFailure(
          error.response?.data?.message || error.message || "Unknown error"
        )
      );
    }
  };
};

// Update category
export const updateProductCategory = (id: string, data: any) => {
  return async (dispatch: AppDispatch) => {
    dispatch(fetchProductCategoryRequest());
    try {
      await http.patch(`${API_ENDPOINT}/${AdminConfig.routes.categoryProduct}/${id}`, data);
      dispatch(fetchProductCategory()); // reload danh mục
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      dispatch(
        fetchProductCategoryFailure(
          error.response?.data?.message || error.message || "Unknown error"
        )
      );
    }
  };
};

// Delete category
export const deleteProductCategory = (
  id: string,
  name: string = "",
  page: number = 1,
  pageSize: number = 10
) => {
  return async (dispatch: AppDispatch) => {
    dispatch(fetchProductCategoryRequest());
    try {
      await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.categoryProduct}/${id}`);
      dispatch(fetchProductCategory(name, "", page, pageSize)); // reload danh mục
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      dispatch(
        fetchProductCategoryFailure(
          error.response?.data?.message || error.message || "Unknown error"
        )
      );
    }
  };
};
