import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { AxiosError, AxiosResponse } from "axios";
import { API_ENDPOINT } from "../Config/APIs";
import AdminConfig from "../Config/index";
import http from "../Utils/Http";
import { RootState } from "../store"; // ⚠️ Cập nhật đúng đường dẫn store của bạn

// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_ROLEPERMISSIONS_REQUEST = "FETCH_ROLEPERMISSIONS_REQUEST" as const;
export const FETCH_ROLEPERMISSIONS_SUCCESS = "FETCH_ROLEPERMISSIONS_SUCCESS" as const;
export const FETCH_ROLEPERMISSIONS_FAILURE = "FETCH_ROLEPERMISSIONS_FAILURE" as const;
export const SET_CURRENT_PAGE = "SET_CURRENT_PAGE" as const;

// ------------------------------
// 🔹 Interface cho dữ liệu RolePermission
// ------------------------------
export interface RolePermission {
  id: number;
  role_id: number;
  permission_id: number;
  [key: string]: any;
}

export interface RolePermissionResponse {
  results: RolePermission[];
  totalCount?: number;
  totalPages?: number;
  currentPage?: number;
}

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchRolePermissionsRequest = () => ({
  type: FETCH_ROLEPERMISSIONS_REQUEST,
});

export const fetchRolePermissionsSuccess = (
  results: RolePermission[],
  totalCount?: number,
  totalPages?: number,
  currentPage?: number
) => ({
  type: FETCH_ROLEPERMISSIONS_SUCCESS,
  payload: { results, totalCount, totalPages, currentPage },
});

export const fetchRolePermissionsFailure = (error: string) => ({
  type: FETCH_ROLEPERMISSIONS_FAILURE,
  payload: error,
});

export const setCurrentPage = (page: number) => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});

// ------------------------------
// 🔹 Type Helper
// ------------------------------
type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;

// ------------------------------
// 🔹 Fetch RolePermissions theo roleId
// ------------------------------
export const fetchRolePermissions =
  (roleId: number): AppThunk =>
  async (dispatch) => {
    dispatch(fetchRolePermissionsRequest());
    try {
      const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.rolesPermissions}`);
      url.searchParams.append("role_id", roleId.toString());

      const response: AxiosResponse<RolePermissionResponse> = await http.get(url.toString());
      const { results, totalCount, totalPages, currentPage } = response.data;

      dispatch(fetchRolePermissionsSuccess(results, totalCount, totalPages, currentPage));
    } catch (error) {
      const err = error as AxiosError;
      const message =
        (err.response?.data as any)?.error || err.message || "Lỗi khi tải quyền vai trò.";
      dispatch(fetchRolePermissionsFailure(message));
    }
  };

// ------------------------------
// 🔹 Thêm RolePermissions
// ------------------------------
export const addRolePermissions =
  (rolesPermissions: Partial<RolePermission>[]): AppThunk<Promise<void>> =>
  async (dispatch) => {
    dispatch(fetchRolePermissionsRequest());
    try {
      await http.post(`${API_ENDPOINT}/${AdminConfig.routes.rolesPermissions}`, rolesPermissions);
      return Promise.resolve();
    } catch (error) {
      const err = error as AxiosError;
      if (err.response) {
        const status = err.response.status;
        switch (status) {
          case 409:
            throw new Error("Đã xảy ra lỗi: Dữ liệu bị trùng lặp.");
          case 400:
            throw new Error(
              `Yêu cầu không hợp lệ: ${
                (err.response.data as any)?.message || "Vui lòng kiểm tra dữ liệu."
              }`
            );
          case 404:
            throw new Error("Tài nguyên không tìm thấy: Vui lòng kiểm tra lại đường dẫn.");
          case 500:
            throw new Error("Lỗi máy chủ: Đã xảy ra lỗi trong quá trình xử lý yêu cầu.");
          default:
            throw new Error(`Đã xảy ra lỗi: ${(err.response.data as any)?.message || err.message}`);
        }
      } else {
        throw new Error("Đã xảy ra lỗi không xác định.");
      }
    }
  };

// ------------------------------
// 🔹 Cập nhật RolePermission
// ------------------------------
export const updateRolePermissions =
  (id: number, data: Partial<RolePermission>): AppThunk =>
  async (dispatch) => {
    dispatch(fetchRolePermissionsRequest());
    try {
      await http.patch(`${API_ENDPOINT}/${AdminConfig.routes.rolesPermissions}/${id}`, data);
      dispatch(fetchRolePermissions(data.role_id ?? 0));
    } catch (error) {
      const err = error as AxiosError;
      const message =
        (err.response?.data as any)?.message || err.message || "Lỗi khi cập nhật quyền vai trò.";
      dispatch(fetchRolePermissionsFailure(message));
    }
  };

// ------------------------------
// 🔹 Xóa RolePermission
// ------------------------------
export const deleteRolePermissions =
  (id: number, roleId?: number): AppThunk =>
  async (dispatch) => {
    dispatch(fetchRolePermissionsRequest());
    try {
      await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.rolesPermissions}/${id}`);
      if (roleId) dispatch(fetchRolePermissions(roleId));
    } catch (error) {
      const err = error as AxiosError;
      const message =
        (err.response?.data as any)?.message || err.message || "Lỗi khi xóa quyền vai trò.";
      dispatch(fetchRolePermissionsFailure(message));
    }
  };
