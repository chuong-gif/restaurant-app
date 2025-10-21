import type { ThunkAction } from "redux-thunk";
import type { AnyAction } from "redux";
import type { AxiosResponse, AxiosError } from "axios";
import { API_ENDPOINT } from "../configs/APIs";
import ClientConfig from "../configs/index";
import http from "../Utils/Http";

// ------------------------------
// 🔹 Tạo kiểu AppThunk (nếu chưa có store)
// ------------------------------
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  any,
  unknown,
  AnyAction
>;

// ------------------------------
// 🔹 Kiểu dữ liệu
// ------------------------------
export interface CommentBlog {
  id?: string;
  content: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface CommentBlogListResponse {
  results: CommentBlog[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_COMMENTBLOG_REQUEST = "FETCH_COMMENTBLOG_REQUEST" as const;
export const FETCH_COMMENTBLOG_SUCCESS = "FETCH_COMMENTBLOG_SUCCESS" as const;
export const FETCH_COMMENTBLOG_FAILURE = "FETCH_COMMENTBLOG_FAILURE" as const;
export const SET_CURRENT_PAGE = "SET_CURRENT_PAGE" as const;

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchCommentBlogRequest = () => ({
  type: FETCH_COMMENTBLOG_REQUEST,
});

export const fetchCommentBlogSuccess = (
  results: CommentBlog[],
  totalCount: number,
  totalPages: number,
  currentPage: number
) => ({
  type: FETCH_COMMENTBLOG_SUCCESS,
  payload: {
    results,
    totalCount,
    totalPages,
    currentPage,
  },
});

export const fetchCommentBlogFailure = (error: string) => ({
  type: FETCH_COMMENTBLOG_FAILURE,
  payload: error,
});

export const setCurrentPage = (page: number) => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});

// ------------------------------
// 🔹 Thunk Actions
// ------------------------------

// 📦 Lấy danh sách comment blog
export const fetchCommentBlog =
  (content: string = "", page: number = 1, pageSize: number = 20): AppThunk =>
  async (dispatch) => {
    dispatch(fetchCommentBlogRequest());

    try {
      const url = new URL(`${API_ENDPOINT}/public/${ClientConfig.routes.commentBlog}`);
      if (content) {
        url.searchParams.append("search", content);
      }
      url.searchParams.append("page", page.toString());
      url.searchParams.append("pageSize", pageSize.toString());

      const response: AxiosResponse<CommentBlogListResponse> = await http.get(
        url.toString()
      );

      const { results, totalCount, totalPages, currentPage } = response.data;
      dispatch(fetchCommentBlogSuccess(results, totalCount, totalPages, currentPage));
    } catch (error) {
      const err = error as AxiosError;
      const msg = (err.response?.data as any)?.message || err.message;
      dispatch(fetchCommentBlogFailure(msg));
    }
  };

// 🆕 Thêm comment blog
export const addCommentBlog =
  (commentblog: CommentBlog): AppThunk<Promise<void>> =>
  async (dispatch) => {
    dispatch(fetchCommentBlogRequest());

    try {
      const response: AxiosResponse<CommentBlog> = await http.post(
        `${API_ENDPOINT}/${ClientConfig.routes.commentBlog}`,
        commentblog
      );
      dispatch(fetchCommentBlogSuccess([response.data], 1, 1, 1));
    } catch (error) {
      const err = error as AxiosError;
      const msg = err.message || "Failed to add comment";
      dispatch(fetchCommentBlogFailure(msg));
      throw err;
    }
  };

// ✏️ Cập nhật comment blog
export const updateCommentBlog =
  (id: string, data: Partial<CommentBlog>): AppThunk =>
  async (dispatch) => {
    dispatch(fetchCommentBlogRequest());
    try {
      await http.patch(`${API_ENDPOINT}/${ClientConfig.routes.commentBlog}/${id}`, data);
      dispatch(fetchCommentBlog());
    } catch (error) {
      const err = error as AxiosError;
      const msg = (err.response?.data as any)?.message || err.message;
      dispatch(fetchCommentBlogFailure(msg));
    }
  };

// 🗑️ Xóa comment blog
export const deleteCommentBlog =
  (id: string): AppThunk =>
  async (dispatch) => {
    dispatch(fetchCommentBlogRequest());
    try {
      await http.delete(`${API_ENDPOINT}/${ClientConfig.routes.commentBlog}/${id}`);
      dispatch(fetchCommentBlog());
    } catch (error) {
      const err = error as AxiosError;
      const msg = (err.response?.data as any)?.message || err.message;
      dispatch(fetchCommentBlogFailure(msg));
    }
  };
