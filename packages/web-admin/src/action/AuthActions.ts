import axios from "axios";
import type { ThunkAction } from "redux-thunk";
import type { AnyAction } from "redux";
import { API_ENDPOINT, API_DATA } from "../configs/client/APIs";
import AdminConfig from "../configs/client/index";


// ------------------------------
// 🔹 Action Type Constants
// ------------------------------
export const FETCH_AUTH_REQUEST = "FETCH_AUTH_REQUEST";
export const FETCH_AUTH_SUCCESS = "FETCH_AUTH_SUCCESS";
export const FETCH_AUTH_FAILURE = "FETCH_AUTH_FAILURE";

export const CHECK_PASSWORD_REQUEST = "CHECK_PASSWORD_REQUEST";
export const CHECK_PASSWORD_SUCCESS = "CHECK_PASSWORD_SUCCESS";
export const CHECK_PASSWORD_FAILURE = "CHECK_PASSWORD_FAILURE";

export const SHOW_SUCCESS_ALERT = "SHOW_SUCCESS_ALERT";
export const SHOW_ERROR_ALERT = "SHOW_ERROR_ALERT";

// ------------------------------
// 🔹 Interfaces
// ------------------------------
export interface AuthData {
  token?: string;
  data?: any;
  user?: any;
  message?: string;
}

export interface AuthState {
  loading: boolean;
  auth: AuthData | null;
  error: string;
  successAlert: string | null;
  errorAlert: string | null;
  isAuthenticated: boolean;
}

export interface AuthAction {
  type: string;
  payload?: any;
}

// ------------------------------
// 🔹 Redux Thunk Type
// ------------------------------
type ThunkResult<R> = ThunkAction<R, AuthState, undefined, AnyAction>;

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchAuthRequest = (): AuthAction => ({
  type: FETCH_AUTH_REQUEST,
});

export const fetchAuthSuccess = (auth: AuthData): AuthAction => ({
  type: FETCH_AUTH_SUCCESS,
  payload: auth,
});

export const fetchAuthFailure = (error: string): AuthAction => ({
  type: FETCH_AUTH_FAILURE,
  payload: error,
});

export const checkPasswordRequest = (): AuthAction => ({
  type: CHECK_PASSWORD_REQUEST,
});

export const checkPasswordSuccess = (message: string): AuthAction => ({
  type: CHECK_PASSWORD_SUCCESS,
  payload: message,
});

export const checkPasswordFailure = (error: string): AuthAction => ({
  type: CHECK_PASSWORD_FAILURE,
  payload: error,
});

export const showSuccessAlert = (message: string): AuthAction => ({
  type: SHOW_SUCCESS_ALERT,
  payload: message,
});

export const showErrorAlert = (message: string): AuthAction => ({
  type: SHOW_ERROR_ALERT,
  payload: message,
});

// ------------------------------
// 🔹 Async Actions
// ------------------------------

// Đăng nhập
export const fetchLogin =
  (email: string, password: string): ThunkResult<Promise<void>> =>
  async (dispatch) => {
    dispatch(fetchAuthRequest());
    try {
      const response = await axios.post(`${API_ENDPOINT}/auth_admin/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        const data = response.data;
        dispatch(fetchAuthSuccess(data));

        // Lưu thông tin vào localStorage
        localStorage.setItem("user_admin", JSON.stringify(data.data));
      } else {
        dispatch(fetchAuthFailure("Unexpected response status: " + response.status));
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      dispatch(fetchAuthFailure(message));
    }
  };

// Kiểm tra mật khẩu
export const checkPassword =
  (email: string, currentPassword: string): ThunkResult<Promise<string>> =>
  async (dispatch) => {
    dispatch(checkPasswordRequest());
    try {
      const response = await axios.post(`${API_ENDPOINT}/users/check-password`, {
        email,
        currentPassword,
      });
      dispatch(checkPasswordSuccess(response.data.message));
      return response.data.message;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message;
      dispatch(checkPasswordFailure(message));
      return message;
    }
  };

// Cập nhật thông tin cá nhân
export const updateProfile =
  (id: number, data: any): ThunkResult<void> =>
  async (dispatch) => {
    dispatch(fetchAuthRequest());
    try {
      const response = await axios.patch(
        `${API_ENDPOINT}/${AdminConfig.routes.users}/${id}`,
        data
      );
      dispatch(fetchAuthSuccess(response.data.data));
    } catch (error: any) {
      console.error("Update profile error:", error);
      dispatch(fetchAuthFailure(error.message));
    }
  };

// Quên mật khẩu
export const forgotPassword =
  (email: string): ThunkResult<Promise<void>> =>
  async (dispatch) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/${API_DATA.forgotPassword}`,
        { email }
      );
      dispatch({ type: FETCH_AUTH_SUCCESS, payload: response.data });
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Email không tồn tại trong hệ thống.");
      } else {
        throw new Error("Có lỗi xảy ra, vui lòng thử lại.");
      }
    }
  };

// Thay đổi mật khẩu
export const changePassword =
  (token: string, newPassword: string): ThunkResult<Promise<void>> =>
  async (dispatch) => {
    dispatch(fetchAuthRequest());
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/${API_DATA.changePassword}`,
        { token, newPassword }
      );

      if (response.status === 200) {
        const data = response.data;
        dispatch(fetchAuthSuccess(data));
        dispatch(showSuccessAlert("Đổi mật khẩu thành công"));
      } else {
        dispatch(fetchAuthFailure("Unexpected response status: " + response.status));
        dispatch(showErrorAlert("Không thể đổi mật khẩu"));
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      dispatch(fetchAuthFailure(message));
      dispatch(showErrorAlert(message));
      throw error;
    }
  };

// Lấy quyền hạn người dùng
export const getPermissions =
  (id: number): ThunkResult<Promise<void>> =>
  async (dispatch) => {
    dispatch(fetchAuthRequest());
    try {
      const response = await axios.post(`${API_ENDPOINT}/auth_admin/role_permissions`, {
        id,
      });
      if (response.status === 200) {
        dispatch(fetchAuthSuccess(response.data));
      } else {
        dispatch(fetchAuthFailure("Unexpected response status: " + response.status));
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      dispatch(fetchAuthFailure(message));
    }
  };
