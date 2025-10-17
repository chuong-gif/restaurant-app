// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_PRODUCT_REQUEST = "FETCH_PRODUCT_REQUEST";
export const FETCH_PRODUCT_SUCCESS = "FETCH_PRODUCT_SUCCESS";
export const FETCH_PRODUCT_FAILURE = "FETCH_PRODUCT_FAILURE";
export const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";
export const SET_LIMIT = "SET_LIMIT";

import { API_ENDPOINT } from "../configs/client/APIs";
import AdminConfig from "../configs/client/index";
import http from "../Utils/Http";
import type { ThunkDispatch } from "redux-thunk";
import type { AnyAction } from "redux";

// ------------------------------
// 🔹 Types
// ------------------------------
export interface Product {
  id?: string;
  name?: string;
  categoryId?: string;
  price?: number;
  [key: string]: any;
}

export interface ProductState {
  results: Product[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface ProductAction {
  type: string;
  payload?: any;
}

// Type cho Dispatch sử dụng redux-thunk
export type AppDispatch = ThunkDispatch<ProductState, void, AnyAction>;

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchProductRequest = (): ProductAction => ({
  type: FETCH_PRODUCT_REQUEST,
});

export const fetchProductSuccess = (
  results: Product[],
  totalCount: number = 0,
  totalPages: number = 0,
  currentPage: number = 1
): ProductAction => ({
  type: FETCH_PRODUCT_SUCCESS,
  payload: { results, totalCount, totalPages, currentPage },
});

export const fetchProductFailure = (error: string): ProductAction => ({
  type: FETCH_PRODUCT_FAILURE,
  payload: error,
});

export const setCurrentPage = (page: number): ProductAction => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});

export const setLimit = (limit: number): ProductAction => ({
  type: SET_LIMIT,
  payload: limit,
});

// ------------------------------
// 🔹 Thunks
// ------------------------------
export const fetchProduct =
  (name: string = "", page: number = 1, pageSize: number = 10, activeStatus: string | null = null) =>
  async (dispatch: AppDispatch) => {
    dispatch(fetchProductRequest());
    try {
      const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.product}`);
      if (name) url.searchParams.append("search", name);
      url.searchParams.append("page", String(page));
      url.searchParams.append("pageSize", String(pageSize));
      if (activeStatus !== null) url.searchParams.append("status", activeStatus);

      const response = await http.get(url.toString());
      const { results, totalCount, totalPages, currentPage } = response.data;
      dispatch(fetchProductSuccess(results, totalCount, totalPages, currentPage));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      dispatch(fetchProductFailure(message));
    }
  };

// ------------------------------
// 🔹 Fetch menu products (no pagination)
// ------------------------------
export const fetchMenu = () => async (dispatch: AppDispatch) => {
  dispatch(fetchProductRequest());
  try {
    const response = await http.get(`${API_ENDPOINT}/${AdminConfig.routes.product}/menu`);
    dispatch(fetchProductSuccess(response.data.results));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    dispatch(fetchProductFailure(message));
  }
};

// ------------------------------
// 🔹 Fetch active/inactive products
// ------------------------------
const fetchProductByStatus =
  (
    statusEndpoint: string,
    name: string = "",
    categoryId: string = "",
    page: number = 1,
    pageSize: number = 10
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(fetchProductRequest());
    try {
      const limit = parseInt(localStorage.getItem("limit") || String(pageSize), 10);
      const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.product}/${statusEndpoint}`);
      if (name) url.searchParams.append("searchName", name);
      if (categoryId) url.searchParams.append("searchCateID", categoryId);
      url.searchParams.append("page", String(page));
      url.searchParams.append("limit", String(limit));

      const response = await http.get(url.toString());
      const { results, totalCount, totalPages, currentPage } = response.data;
      dispatch(fetchProductSuccess(results, totalCount, totalPages, currentPage));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      dispatch(fetchProductFailure(message));
    }
  };

export const fetchProductHoatDong = (
  name?: string,
  categoryId?: string,
  page?: number,
  pageSize?: number
) => fetchProductByStatus("hoat_dong", name, categoryId, page, pageSize);

export const fetchProductNgungHoatDong = (
  name?: string,
  categoryId?: string,
  page?: number,
  pageSize?: number
) => fetchProductByStatus("ngung_hoat_dong", name, categoryId, page, pageSize);

// ------------------------------
// 🔹 Add / Update / Delete Product
// ------------------------------
export const addProduct = (product: Product) => async (dispatch: AppDispatch) => {
  dispatch(fetchProductRequest());
  try {
    await http.post(`${API_ENDPOINT}/${AdminConfig.routes.product}`, product);
    dispatch(fetchProductHoatDong());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    dispatch(fetchProductFailure(message));
  }
};

export const updateProduct = (id: string, data: Product) => async (dispatch: AppDispatch) => {
  dispatch(fetchProductRequest());
  try {
    await http.patch(`${API_ENDPOINT}/${AdminConfig.routes.product}/${id}`, data);
    dispatch(fetchProductHoatDong());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    dispatch(fetchProductFailure(message));
  }
};

export const updateStatus =
  (
    id: string,
    data: Product,
    start: string = "list",
    name: string = "",
    categoryId: string = "",
    page: number = 1,
    pageSize: number = 10
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(fetchProductRequest());
    try {
      await http.patch(`${API_ENDPOINT}/${AdminConfig.routes.product}/${id}`, data);
      if (start === "list") {
        dispatch(fetchProductHoatDong(name, categoryId, page, pageSize));
      } else {
        dispatch(fetchProductNgungHoatDong(name, categoryId, page, pageSize));
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      dispatch(fetchProductFailure(message));
    }
  };

export const deleteProduct = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(fetchProductRequest());
  try {
    await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.product}/${id}`);
    dispatch(fetchProduct());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    dispatch(fetchProductFailure(message));
  }
};
