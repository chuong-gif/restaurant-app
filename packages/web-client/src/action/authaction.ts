import axios, { AxiosError, AxiosResponse } from "axios";
import { API_ENDPOINT, API_DATA } from "../Config/APIs";
import AdminConfig from "../Config/index";

// Định nghĩa kiểu dữ liệu
export interface AuthData {
    token?: string;
    data?: any;
    message?: string;
}

export interface UserProfile {
    id: string;
    email: string;
    name?: string;
    [key: string]: any;
}

// Các hằng action
export const FETCH_AUTH_REQUEST = 'FETCH_AUTH_REQUEST' as const;
export const FETCH_AUTH_SUCCESS = 'FETCH_AUTH_SUCCESS' as const;
export const FETCH_AUTH_FAILURE = 'FETCH_AUTH_FAILURE' as const;

export const CHECK_PASSWORD_REQUEST = 'CHECK_PASSWORD_REQUEST' as const;
export const CHECK_PASSWORD_SUCCESS = 'CHECK_PASSWORD_SUCCESS' as const;
export const CHECK_PASSWORD_FAILURE = 'CHECK_PASSWORD_FAILURE' as const;

export const SHOW_SUCCESS_ALERT = 'SHOW_SUCCESS_ALERT' as const;
export const SHOW_ERROR_ALERT = 'SHOW_ERROR_ALERT' as const;

// Kiểu cho Redux Action
export type AuthAction =
    | { type: typeof FETCH_AUTH_REQUEST }
    | { type: typeof FETCH_AUTH_SUCCESS; payload: AuthData }
    | { type: typeof FETCH_AUTH_FAILURE; payload: string }
    | { type: typeof CHECK_PASSWORD_REQUEST }
    | { type: typeof CHECK_PASSWORD_SUCCESS; payload: string }
    | { type: typeof CHECK_PASSWORD_FAILURE; payload: string }
    | { type: typeof SHOW_SUCCESS_ALERT; payload: string }
    | { type: typeof SHOW_ERROR_ALERT; payload: string };

// Các action creators
export const fetchAuthRequest = (): AuthAction => ({ type: FETCH_AUTH_REQUEST });
export const fetchAuthSuccess = (auth: AuthData): AuthAction => ({ type: FETCH_AUTH_SUCCESS, payload: auth });
export const fetchAuthFailure = (error: string): AuthAction => ({ type: FETCH_AUTH_FAILURE, payload: error });

export const checkPasswordRequest = (): AuthAction => ({ type: CHECK_PASSWORD_REQUEST });
export const checkPasswordSuccess = (message: string): AuthAction => ({ type: CHECK_PASSWORD_SUCCESS, payload: message });
export const checkPasswordFailure = (error: string): AuthAction => ({ type: CHECK_PASSWORD_FAILURE, payload: error });

export const showSuccessAlert = (message: string): AuthAction => ({ type: SHOW_SUCCESS_ALERT, payload: message });
export const showErrorAlert = (message: string): AuthAction => ({ type: SHOW_ERROR_ALERT, payload: message });

// Kiểu cho Redux Thunk
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store'; // bạn cần có kiểu RootState từ store.ts
import { AnyAction } from 'redux';

type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

// --- API Actions ---

// Đăng nhập
export const fetchLogin = (email: string, password: string): AppThunk => async (dispatch) => {
    dispatch(fetchAuthRequest());
    try {
        const response: AxiosResponse<AuthData> = await axios.post(`${API_ENDPOINT}/auth_admin/login`, { email, password });
        if (response.status === 200) {
            const data = response.data;
            dispatch(fetchAuthSuccess(data));
            localStorage.setItem('user_admin', JSON.stringify(data.data));
        } else {
            dispatch(fetchAuthFailure(`Unexpected response status: ${response.status}`));
        }
    } catch (error) {
        const err = error as AxiosError;
        dispatch(fetchAuthFailure(err.response?.data?.message || err.message));
    }
};

// Kiểm tra mật khẩu
export const checkPassword = (email: string, currentPassword: string): AppThunk<Promise<string>> => async (dispatch) => {
    dispatch(checkPasswordRequest());
    try {
        const response = await axios.post(`${API_ENDPOINT}/users/check-password`, { email, currentPassword });
        dispatch(checkPasswordSuccess(response.data.message));
        return response.data.message;
    } catch (error) {
        const err = error as AxiosError;
        const errorMsg = (err.response?.data as any)?.error || err.message;
        dispatch(checkPasswordFailure(errorMsg));
        return errorMsg;
    }
};

// Cập nhật hồ sơ
export const updateProfile = (id: string, data: Partial<UserProfile>): AppThunk => async (dispatch) => {
    dispatch(fetchAuthRequest());
    try {
        const response = await axios.patch(`${API_ENDPOINT}/${AdminConfig.routes.users}/${id}`, data);
        dispatch(fetchAuthSuccess(response.data.data));
    } catch (error) {
        const err = error as AxiosError;
        dispatch(fetchAuthFailure(err.message));
    }
};

// Quên mật khẩu
export const forgotPassword = (email: string): AppThunk<Promise<void>> => async (dispatch) => {
    try {
        const response = await axios.post(`${API_ENDPOINT}/${API_DATA.forgotPassword}`, { email });
        dispatch(fetchAuthSuccess(response.data));
    } catch (error) {
        const err = error as AxiosError;
        if (err.response?.status === 404) throw new Error('Email không tồn tại trong hệ thống.');
        else throw new Error('Có lỗi xảy ra, vui lòng thử lại.');
    }
};

// Đổi mật khẩu
export const changePassword = (token: string, newPassword: string): AppThunk<Promise<void>> => async (dispatch) => {
    dispatch(fetchAuthRequest());
    try {
        const response = await axios.post(`${API_ENDPOINT}/${API_DATA.changePassword}`, { token, newPassword });
        if (response.status === 200) {
            dispatch(fetchAuthSuccess(response.data));
            dispatch(showSuccessAlert('Đổi mật khẩu thành công'));
        } else {
            dispatch(fetchAuthFailure(`Unexpected response status: ${response.status}`));
            dispatch(showErrorAlert('Không thể đổi mật khẩu'));
        }
    } catch (error) {
        const err = error as AxiosError;
        const msg = err.response?.data?.message || err.message;
        dispatch(fetchAuthFailure(msg));
        dispatch(showErrorAlert(msg));
        throw err;
    }
};

// Lấy quyền hạn
export const getPermissions = (id: string): AppThunk => async (dispatch) => {
    dispatch(fetchAuthRequest());
    try {
        const response = await axios.post(`${API_ENDPOINT}/auth_admin/role_permissions`, { id });
        dispatch(fetchAuthSuccess(response.data));
    } catch (error) {
        const err = error as AxiosError;
        dispatch(fetchAuthFailure(err.response?.data?.message || err.message));
    }
};
