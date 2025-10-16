import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { API_ENDPOINT } from "../Config/APIs";
import AdminConfig from "../Config/index";
import http from "../Utils/Http";

// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_CATEGORY_BLOG_REQUEST = "FETCH_CATEGORY_BLOG_REQUEST";
export const FETCH_CATEGORY_BLOG_SUCCESS = "FETCH_CATEGORY_BLOG_SUCCESS";
export const FETCH_CATEGORY_BLOG_FAILURE = "FETCH_CATEGORY_BLOG_FAILURE";
export const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";
export const SET_LIMIT = "SET_LIMIT";

// ------------------------------
// 🔹 Interfaces
// ------------------------------
export interface CategoryBlog {
  id: number;
  name: string;
  status?: string;
  [key: string]: any;
}

export interface CategoryBlogPayload {
  results: CategoryBlog[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface CategoryBlogState {
  loading: boolean;
  allCategoryBlog: CategoryBlog[];
  categoryBlog: CategoryBlog[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  error: string;
}

export interface CategoryBlogAction {
  type: string;
  payload?: any;
}

// ------------------------------
// 🔹 Thunk Type
// ------------------------------
type ThunkResult<R> = ThunkAction<R, CategoryBlogState, undefined, AnyAction>;

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchCategoryBlogRequest = (): CategoryBlogAction => ({
  type: FETCH_CATEGORY_BLOG_REQUEST,
});

export const fetchCategoryBlogSuccess = ({
  results,
  totalCount,
  totalPages,
  currentPage,
}: CategoryBlogPayload): CategoryBlogAction => ({
  type: FETCH_CATEGORY_BLOG_SUCCESS,
  payload: { results, totalCount, totalPages, currentPage },
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
// 🔹 Thunk Actions
// ------------------------------
export const fetchCategoryBlog =
  (name = "", status = "", page = 1): ThunkResult<Promise<void>> =>
  async (dispatch) => {
    dispatch(fetchCategoryBlogRequest());

    const limit = parseInt(localStorage.getItem("limit") || "5", 10);

    try {
      const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.categoryBlog}`);
      if (name) url.searchParams.append("search", name);
      if (status) url.searchParams.append("searchStatus", status);
      url.searchParams.append("page", page.toString());
      url.searchParams.append("limit", limit.toString());

      const response = await http.get(url.toString());
      const { results, totalCount, totalPages, currentPage } = response.data;

      dispatch(fetchCategoryBlogSuccess({ results, totalCount, totalPages, currentPage }));
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to fetch categories";
      dispatch(fetchCategoryBlogFailure(errorMsg));
    }
  };

// ------------------------------
// 🔹 Add Category Blog
// ------------------------------
export const addCategoryBlog =
  (categoryBlog: Partial<CategoryBlog>): ThunkResult<Promise<void>> =>
  async (dispatch) => {
    dispatch(fetchCategoryBlogRequest());
    try {
      await http.post(`${API_ENDPOINT}/${AdminConfig.routes.categoryBlog}`, categoryBlog);
      dispatch(fetchCategoryBlog());
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to add category";
      dispatch(fetchCategoryBlogFailure(errorMsg));
    }
  };

// ------------------------------
// 🔹 Update Category Blog
// ------------------------------
export const updateCategoryBlog =
  (id: number, data: Partial<CategoryBlog>): ThunkResult<Promise<void>> =>
  async (dispatch) => {
    dispatch(fetchCategoryBlogRequest());
    try {
      await http.patch(`${API_ENDPOINT}/${AdminConfig.routes.categoryBlog}/${id}`, data);
      dispatch(fetchCategoryBlog());
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to update category";
      dispatch(fetchCategoryBlogFailure(errorMsg));
    }
  };

// ------------------------------
// 🔹 Delete Category Blog
// ------------------------------
export const deleteCategoryBlog =
  (id: number): ThunkResult<Promise<void>> =>
  async (dispatch) => {
    dispatch(fetchCategoryBlogRequest());
    try {
      await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.categoryBlog}/${id}`);
      dispatch(fetchCategoryBlog());
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to delete category";
      dispatch(fetchCategoryBlogFailure(errorMsg));
    }
  };
