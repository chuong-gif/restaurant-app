import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { AxiosResponse, AxiosError } from "axios";
import { API_ENDPOINT } from "../Config/APIs";
import AdminConfig from "../Config/index";
import http from "../Utils/Http";
import { RootState } from "../store"; // <-- nhớ chỉnh lại nếu store bạn ở đường dẫn khác

// ------------------------------
// 🔹 Kiểu dữ liệu
// ------------------------------

export interface Blog {
  id?: string;
  title: string;
  content: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface BlogListResponse {
  results: Blog[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface BlogState {
  loading: boolean;
  blogs: Blog[];
  error: string | null;
  currentPage: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

// ------------------------------
// 🔹 Action types
// ------------------------------

export const FETCH_BLOG_REQUEST = "FETCH_BLOG_REQUEST" as const;
export const FETCH_BLOG_SUCCESS = "FETCH_BLOG_SUCCESS" as const;
export const FETCH_BLOG_FAILURE = "FETCH_BLOG_FAILURE" as const;
export const SET_CURRENT_PAGE = "SET_CURRENT_PAGE" as const;
export const SET_LIMIT = "SET_LIMIT" as const;

// ------------------------------
// 🔹 Kiểu Action
// ------------------------------

export type BlogAction =
  | { type: typeof FETCH_BLOG_REQUEST }
  | { type: typeof FETCH_BLOG_SUCCESS; payload: BlogListResponse }
  | { type: typeof FETCH_BLOG_FAILURE; payload: string }
  | { type: typeof SET_CURRENT_PAGE; payload: number }
  | { type: typeof SET_LIMIT; payload: number };

// ------------------------------
// 🔹 Action creators
// ------------------------------

export const fetchBlogRequest = (): BlogAction => ({
  type: FETCH_BLOG_REQUEST,
});

export const fetchBlogSuccess = (
  data: BlogListResponse
): BlogAction => ({
  type: FETCH_BLOG_SUCCESS,
  payload: data,
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
// 🔹 Kiểu Redux Thunk
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

// Lấy danh sách blog
export const fetchBlog =
  (name = "", page = 1): AppThunk =>
  async (dispatch) => {
    dispatch(fetchBlogRequest());

    const limit = parseInt(localStorage.getItem("limit") || "5", 10);

    try {
      const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.blog}`);

      if (name) url.searchParams.append("searchName", name);
      url.searchParams.append("page", page.toString());
      url.searchParams.append("limit", limit.toString());

      const response: AxiosResponse<BlogListResponse> = await http.get(
        url.toString()
      );

      const { results, totalCount, totalPages, currentPage } = response.data;

      dispatch(fetchBlogSuccess({ results, totalCount, totalPages, currentPage }));
    } catch (error) {
      const err = error as AxiosError;
      const errorMsg =
        (err.response?.data as any)?.message || err.message || "Failed to fetch blogs";
      dispatch(fetchBlogFailure(errorMsg));
    }
  };

// Thêm blog mới
export const addBlog =
  (blog: Blog): AppThunk =>
  async (dispatch) => {
    dispatch(fetchBlogRequest());
    try {
      const response: AxiosResponse<{ data: Blog }> = await http.post(
        `${API_ENDPOINT}/${AdminConfig.routes.blog}`,
        blog
      );

      dispatch(fetchBlogSuccess({
        results: [response.data.data],
        totalCount: 1,
        totalPages: 1,
        currentPage: 1,
      }));

      // Làm mới danh sách
      dispatch(fetchBlog());
    } catch (error) {
      const err = error as AxiosError;
      dispatch(fetchBlogFailure(err.message));
    }
  };

// Cập nhật blog
export const updateBlog =
  (id: string, data: Partial<Blog>): AppThunk =>
  async (dispatch) => {
    dispatch(fetchBlogRequest());
    try {
      const response: AxiosResponse<{ data: Blog }> = await http.patch(
        `${API_ENDPOINT}/${AdminConfig.routes.blog}/${id}`,
        data
      );

      dispatch(fetchBlogSuccess({
        results: [response.data.data],
        totalCount: 1,
        totalPages: 1,
        currentPage: 1,
      }));

      dispatch(fetchBlog());
    } catch (error) {
      const err = error as AxiosError;
      dispatch(fetchBlogFailure(err.message));
    }
  };

// Xóa blog
export const deleteBlog =
  (id: string): AppThunk =>
  async (dispatch) => {
    dispatch(fetchBlogRequest());
    try {
      await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.blog}/${id}`);
      dispatch(fetchBlog()); // Làm mới danh sách sau khi xóa
    } catch (error) {
      const err = error as AxiosError;
      dispatch(fetchBlogFailure(err.message));
    }
  };
