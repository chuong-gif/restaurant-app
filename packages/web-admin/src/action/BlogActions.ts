import type { ThunkAction } from "redux-thunk";
import type { AnyAction } from "redux";
import { API_ENDPOINT } from "../configs/client/APIs";
import AdminConfig from "../configs/client/index";
import http from "../Utils/Http";


// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_BLOG_REQUEST = "FETCH_BLOG_REQUEST";
export const FETCH_BLOG_SUCCESS = "FETCH_BLOG_SUCCESS";
export const FETCH_BLOG_FAILURE = "FETCH_BLOG_FAILURE";
export const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";
export const SET_LIMIT = "SET_LIMIT";

// ------------------------------
// 🔹 Interfaces
// ------------------------------
export interface Blog {
  id: number;
  title: string;
  content: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface BlogPayload {
  results: Blog[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface BlogState {
  loading: boolean;
  blogs: Blog[];
  allBlog: Blog[];
  currentPage: number;
  totalCount: number;
  totalPages: number;
  pageSize: number;
  error: string;
}

export interface BlogAction {
  type: string;
  payload?: any;
}

// ------------------------------
// 🔹 Thunk Type
// ------------------------------
type ThunkResult<R> = ThunkAction<R, BlogState, undefined, AnyAction>;

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchBlogRequest = (): BlogAction => ({
  type: FETCH_BLOG_REQUEST,
});

export const fetchBlogSuccess = ({
  results,
  totalCount,
  totalPages,
  currentPage,
}: BlogPayload): BlogAction => ({
  type: FETCH_BLOG_SUCCESS,
  payload: { results, totalCount, totalPages, currentPage },
});

export const fetchBlogFailure = (error: string): BlogAction => ({
  type: FETCH_BLOG_FAILURE,
  payload: error,
});

export const setCurrentPage = (page: number): BlogAction => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});

export const setLimit = (limit: number): BlogAction => ({
  type: SET_LIMIT,
  payload: limit,
});

// ------------------------------
// 🔹 Thunk Actions
// ------------------------------
export const fetchBlog =
  (name = "", page = 1): ThunkResult<Promise<void>> =>
  async (dispatch) => {
    dispatch(fetchBlogRequest());

    const limit = parseInt(localStorage.getItem("limit") || "5", 10);

    try {
      const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.blog}`);
      if (name) url.searchParams.append("searchName", name);
      url.searchParams.append("page", page.toString());
      url.searchParams.append("limit", limit.toString());

      const response = await http.get(url.toString());
      const { results, totalCount, totalPages, currentPage } = response.data;

      dispatch(fetchBlogSuccess({ results, totalCount, totalPages, currentPage }));
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || error.message || "Failed to fetch blogs";
      dispatch(fetchBlogFailure(errorMsg));
    }
  };

// ------------------------------
// 🔹 Add Blog
// ------------------------------
export const addBlog =
  (blog: Partial<Blog>): ThunkResult<void> =>
  async (dispatch) => {
    dispatch(fetchBlogRequest());
    try {
      const response = await http.post(
        `${API_ENDPOINT}/${AdminConfig.routes.blog}`,
        blog
      );
      dispatch(fetchBlogSuccess(response.data.data));
      dispatch(fetchBlog());
    } catch (error: any) {
      dispatch(fetchBlogFailure(error.message));
    }
  };

// ------------------------------
// 🔹 Update Blog
// ------------------------------
export const updateBlog =
  (id: number, data: Partial<Blog>): ThunkResult<void> =>
  async (dispatch) => {
    dispatch(fetchBlogRequest());
    try {
      const response = await http.patch(
        `${API_ENDPOINT}/${AdminConfig.routes.blog}/${id}`,
        data
      );
      dispatch(fetchBlogSuccess(response.data.data));
      dispatch(fetchBlog());
    } catch (error: any) {
      dispatch(fetchBlogFailure(error.message));
    }
  };

// ------------------------------
// 🔹 Delete Blog
// ------------------------------
export const deleteBlog =
  (id: number): ThunkResult<void> =>
  async (dispatch) => {
    dispatch(fetchBlogRequest());
    try {
      await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.blog}/${id}`);
      dispatch(fetchBlog());
    } catch (error: any) {
      dispatch(fetchBlogFailure(error.message));
    }
  };
