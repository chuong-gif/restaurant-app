import type { ThunkAction } from "redux-thunk";
import type { AnyAction } from "redux";
import { type AxiosResponse, AxiosError } from "axios";
import { API_ENDPOINT } from "../configs/client/APIs";
import AdminConfig from "../configs/client/index";
import http from "../Utils/Http";
import type { RootState } from "../store"; // ⚠️ cập nhật đúng đường dẫn store của bạn
 // ⚠️ cập nhật đúng đường dẫn store của bạn

// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_ROLE_REQUEST = "FETCH_ROLE_REQUEST" as const;
export const FETCH_ROLE_SUCCESS = "FETCH_ROLE_SUCCESS" as const;
export const FETCH_ROLE_FAILURE = "FETCH_ROLE_FAILURE" as const;
export const SET_CURRENT_PAGE = "SET_CURRENT_PAGE" as const;
export const SET_LIMIT = "SET_LIMIT" as const;

// ------------------------------
// 🔹 Interface cho dữ liệu Role
// ------------------------------
export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions?: string[];
  [key: string]: any;
}

export interface RoleResponse {
  results: Role[];
  totalCount?: number;
  totalPages?: number;
  currentPage?: number;
}

export interface RoleState {
  loading: boolean;
  data: Role[];
  error: string | null;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchRoleRequest = () => ({
  type: FETCH_ROLE_REQUEST,
});

export const fetchRoleSuccess = (
  results: Role[],
  totalCount?: number,
  totalPages?: number,
  currentPage?: number
) => ({
  type: FETCH_ROLE_SUCCESS,
  payload: { results, totalCount, totalPages, currentPage },
});

export const fetchRoleFailure = (error: string) => ({
  type: FETCH_ROLE_FAILURE,
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
// 🔹 Type Helper
// ------------------------------
export type RoleAction =
  | ReturnType<typeof fetchRoleRequest>
  | ReturnType<typeof fetchRoleSuccess>
  | ReturnType<typeof fetchRoleFailure>
  | ReturnType<typeof setCurrentPage>
  | ReturnType<typeof setLimit>;

type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;

// ------------------------------
// 🔹 Fetch danh sách Role (có phân trang)
// ------------------------------
export const fetchRole =
  (name = "", page = 1): AppThunk =>
  async (dispatch) => {
    dispatch(fetchRoleRequest());

    const limit = parseInt(localStorage.getItem("limit") || "5", 10);

    try {
      const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.role}`);

      if (name) url.searchParams.append("search", name);
      url.searchParams.append("page", page.toString());
      url.searchParams.append("limit", limit.toString());

      const response: AxiosResponse<RoleResponse> = await http.get(url.toString());
      const { results, totalCount = 0, totalPages = 0, currentPage = 1 } = response.data;

      dispatch(fetchRoleSuccess(results, totalCount, totalPages, currentPage));
    } catch (error) {
      const err = error as AxiosError;
      const message =
        (err.response?.data as any)?.message ||
        err.message ||
        "Failed to fetch roles";
      dispatch(fetchRoleFailure(message));
    }
  };

// ------------------------------
// 🔹 Fetch tất cả Role (không phân trang)
// ------------------------------
export const fetchRole2 = (): AppThunk => async (dispatch) => {
  dispatch(fetchRoleRequest());
  try {
    const response: AxiosResponse<RoleResponse> = await http.get(
      `${API_ENDPOINT}/${AdminConfig.routes.role}`
    );
    dispatch(fetchRoleSuccess(response.data.results));
  } catch (error) {
    const err = error as AxiosError;
    dispatch(fetchRoleFailure(err.message));
  }
};

// ------------------------------
// 🔹 Thêm mới Role
// ------------------------------
export const addRole =
  (role: Partial<Role>): AppThunk<Promise<void>> =>
  async (dispatch) => {
    dispatch(fetchRoleRequest());
    try {
      const response: AxiosResponse<Role> = await http.post(
        `${API_ENDPOINT}/${AdminConfig.routes.role}`,
        role
      );
      dispatch(fetchRoleSuccess([response.data]));
      dispatch(fetchRole());
    } catch (error) {
      const err = error as AxiosError;
      const message =
        (err.response?.data as any)?.error || err.message || "Lỗi không xác định";
      throw new Error(message);
    }
  };

// ------------------------------
// 🔹 Cập nhật Role
// ------------------------------
export const updateRole =
  (id: number, data: Partial<Role>): AppThunk<Promise<void>> =>
  async (dispatch) => {
    dispatch(fetchRoleRequest());
    try {
      const response: AxiosResponse<Role> = await http.patch(
        `${API_ENDPOINT}/${AdminConfig.routes.role}/${id}`,
        data
      );
      dispatch(fetchRoleSuccess([response.data]));
      dispatch(fetchRole());
    } catch (error) {
      const err = error as AxiosError;
      const message =
        (err.response?.data as any)?.error || err.message || "Lỗi không xác định";
      throw new Error(message);
    }
  };

// ------------------------------
// 🔹 Xóa Role
// ------------------------------
export const deleteRole =
  (id: number): AppThunk<Promise<void>> =>
  async (dispatch) => {
    dispatch(fetchRoleRequest());
    try {
      await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.role}/${id}`);
      dispatch(fetchRole());
    } catch (error) {
      const err = error as AxiosError;
      const message =
        (err.response?.data as any)?.error || err.message || "Lỗi không xác định";
      throw new Error(message);
    }
  };
