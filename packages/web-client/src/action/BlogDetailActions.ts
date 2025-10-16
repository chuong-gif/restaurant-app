import { ThunkAction } from "redux-thunk";
import type { AnyAction } from "redux";
import { AxiosError, AxiosResponse } from "axios";
import { API_ENDPOINT } from "../Config/APIs";
import AdminConfig from "../Config/index";
import http from "../Utils/Http";
import { RootState } from "../store"; // 👉 chỉnh đường dẫn cho phù hợp với project của bạn

// ------------------------------
// 🔹 Kiểu dữ liệu
// ------------------------------

export interface CategoryBlog {
  id?: string;
  name: string;
  status?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface CategoryBlogListResponse {
  results: CategoryBlog[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface CategoryBlogState {
  loading: boolean;
  categories: CategoryBlog[];
  error: string | null;
  currentPage: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

// ------------------------------
// 🔹 Action Types
// ------------------------------

export const FETCH_CATEGORY_BLOG_REQUEST = "FETCH_CATEGORY_BLOG_REQUEST" as const;
export const FETCH_CATEGORY_BLOG_SUCCESS = "FETCH_CATEGORY_BLOG_SUCCESS" as const;
export const FETCH_CATEGORY_BLOG_FAILURE = "FETCH_CATEGORY_BLOG_FAILURE" as const;
export const SET_CURRENT_PAGE = "SET_CURRENT_PAGE" as const;
export const SET_LIMIT = "SET_LIMIT" as const;

// ------------------------------
// 🔹 Action Interfaces
// ------------------------------

export type CategoryBlogAction =
  | { type: typeof FETCH_CATEGORY_BLOG_REQUEST }
  | { type: typeof FETCH_CATEGORY_BLOG_SUCCESS; payload: CategoryBlogListResponse }
  | { type: typeof FETCH_CATEGORY_BLOG_FAILURE; payload: string }
  | { type: typeof SET_CURRENT_PAGE; payload: number }
  | { type: typeof SET_LIMIT; payload: number };

// ------------------------------
// 🔹 Action Creators
// ------------------------------

export const fetchCategoryBlogRequest = (): CategoryBlogAction => ({
  type: FETCH_CATEGORY_BLOG_REQUEST,
});

export const fetchCategoryBlogSuccess = (
  data: CategoryBlogListResponse
): CategoryBlogAction => ({
  type: FETCH_CATEGORY_BLOG_SUCCESS,
  payload: data,
});

export const fetchCategoryBlogFailure = (error: string): CategoryBlogAction => ({
  type: FETCH_CATEGORY_BLOG_FAILURE,
  payload: error,
});

export const setCurrentPage = (page: number): CategoryBlogAction => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});

export const setLimit = (limit: number): CategoryBlogAction => ({
  type: SET_LIMIT,
  payload: limit,
});

// ------------------------------
// 🔹 Kiểu Thunk Action
// ------------------------------

type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;

// ------------------------------
// 🔹 Thunk Actions
// ------------------------------

// 📦 Lấy danh sách category blogs
export const fetchCategoryBlog =
  (name = "", status = "", page = 1): AppThunk =>
  async (dispatch) => {
    dispatch(fetchCategoryBlogRequest());

    const limit = parseInt(localStorage.getItem("limit") || "5", 10);

    try {
      const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.categoryBlog}`);

      if (name) url.searchParams.append("search", name);
      if (status) url.searchParams.append("searchStatus", status);

      url.searchParams.append("page", page.toString());
      url.searchParams.append("limit", limit.toString());

      const response: AxiosResponse<CategoryBlogListResponse> = await http.get(
        url.toString()
      );

      const { results, totalCount, totalPages, currentPage } = response.data;
      dispatch(fetchCategoryBlogSuccess({ results, totalCount, totalPages, currentPage }));
    } catch (error) {
      const err = error as AxiosError;
      const errorMsg =
        (err.response?.data as any)?.message ||
        err.message ||
        "Failed to fetch categories";
      dispatch(fetchCategoryBlogFailure(errorMsg));
    }
  };

// 🆕 Thêm category blog
export const addCategoryBlog =
  (categoryBlog: CategoryBlog): AppThunk =>
  async (dispatch) => {
    dispatch(fetchCategoryBlogRequest());
    try {
      await http.post(
        `${API_ENDPOINT}/${AdminConfig.routes.categoryBlog}`,
        categoryBlog
      );
      dispatch(fetchCategoryBlog()); // Làm mới danh sách
    } catch (error) {
      const err = error as AxiosError;
      const errorMsg =
        (err.response?.data as any)?.message ||
        err.message ||
        "Failed to add category";
      dispatch(fetchCategoryBlogFailure(errorMsg));
    }
  };

// ✏️ Cập nhật category blog
export const updateCategoryBlog =
  (id: string, data: Partial<CategoryBlog>): AppThunk =>
  async (dispatch) => {
    dispatch(fetchCategoryBlogRequest());
    try {
      await http.patch(
        `${API_ENDPOINT}/${AdminConfig.routes.categoryBlog}/${id}`,
        data
      );
      dispatch(fetchCategoryBlog()); // Làm mới danh sách
    } catch (error) {
      const err = error as AxiosError;
      const errorMsg =
        (err.response?.data as any)?.message ||
        err.message ||
        "Failed to update category";
      dispatch(fetchCategoryBlogFailure(errorMsg));
    }
  };

// 🗑️ Xóa category blog
export const deleteCategoryBlog =
  (id: string): AppThunk =>
  async (dispatch) => {
    dispatch(fetchCategoryBlogRequest());
    try {
      await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.categoryBlog}/${id}`);
      dispatch(fetchCategoryBlog()); // Làm mới danh sách
    } catch (error) {
      const err = error as AxiosError;
      const errorMsg =
        (err.response?.data as any)?.message ||
        err.message ||
        "Failed to delete category";
      dispatch(fetchCategoryBlogFailure(errorMsg));
    }
  };
