import { API_DATA, API_ENDPOINT } from "../configs/APIs";
import http from "../Utils/Http";
import type { Dispatch } from "redux";
import axios, { type AxiosResponse } from "axios";

// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_USER_REQUEST = "FETCH_USER_REQUEST";
export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
export const FETCH_USER_FAILURE = "FETCH_USER_FAILURE";

export const CHECK_PASSWORD_REQUEST = "CHECK_PASSWORD_REQUEST";
export const CHECK_PASSWORD_SUCCESS = "CHECK_PASSWORD_SUCCESS";
export const CHECK_PASSWORD_FAILURE = "CHECK_PASSWORD_FAILURE";

// ------------------------------
// 🔹 Kiểu dữ liệu
// ------------------------------
export interface User {
    id: string;
    email: string;
    name?: string;
    role?: string;
    [key: string]: any;
}

export interface FetchUserRequestAction {
    type: typeof FETCH_USER_REQUEST;
}

export interface FetchUserSuccessAction {
    type: typeof FETCH_USER_SUCCESS;
    payload: User[];
}

export interface FetchUserFailureAction {
    type: typeof FETCH_USER_FAILURE;
    payload: string;
}

export interface CheckPasswordRequestAction {
    type: typeof CHECK_PASSWORD_REQUEST;
}

export interface CheckPasswordSuccessAction {
    type: typeof CHECK_PASSWORD_SUCCESS;
    payload: string;
}

export interface CheckPasswordFailureAction {
    type: typeof CHECK_PASSWORD_FAILURE;
    payload: string;
}

export type UserActionTypes =
    | FetchUserRequestAction
    | FetchUserSuccessAction
    | FetchUserFailureAction
    | CheckPasswordRequestAction
    | CheckPasswordSuccessAction
    | CheckPasswordFailureAction;

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchUserRequest = (): FetchUserRequestAction => ({
    type: FETCH_USER_REQUEST,
});

export const fetchUserSuccess = (user: User[]): FetchUserSuccessAction => ({
    type: FETCH_USER_SUCCESS,
    payload: user,
});

export const fetchUserFailure = (error: string): FetchUserFailureAction => ({
    type: FETCH_USER_FAILURE,
    payload: error,
});

export const checkPasswordRequest = (): CheckPasswordRequestAction => ({
    type: CHECK_PASSWORD_REQUEST,
});

export const checkPasswordSuccess = (message: string): CheckPasswordSuccessAction => ({
    type: CHECK_PASSWORD_SUCCESS,
    payload: message,
});

export const checkPasswordFailure = (error: string): CheckPasswordFailureAction => ({
    type: CHECK_PASSWORD_FAILURE,
    payload: error,
});

// ------------------------------
// 🔹 Thunk: Fetch user list
// ------------------------------
export const fetchUser = () => {
    return async (dispatch: Dispatch<UserActionTypes>): Promise<User[]> => {
        dispatch(fetchUserRequest());
        try {
            const response: AxiosResponse<{ results: User[] }> = await http.get(
                `${API_ENDPOINT}${API_DATA.users}`
            );

            const user = response.data.results;
            dispatch(fetchUserSuccess(user));
            return user;
        } catch (error: unknown) {
            let errorMsg = "Lỗi khi lấy danh sách người dùng";
            if (axios.isAxiosError(error)) {
                errorMsg = error.response?.data?.message || error.message || errorMsg;
            }
            dispatch(fetchUserFailure(errorMsg));
            throw new Error(errorMsg);
        }
    };
};

// ------------------------------
// 🔹 Thunk: Check password
// ------------------------------
export const checkPassword = (email: string, currentPassword: string) => {
    return async (dispatch: Dispatch<UserActionTypes>): Promise<string> => {
        dispatch(checkPasswordRequest());
        try {
            const response: AxiosResponse<{ message: string }> = await http.post(
                `${API_ENDPOINT}${API_DATA.checkPassword}`,
                { email, currentPassword }
            );

            dispatch(checkPasswordSuccess(response.data.message));
            return response.data.message;
        } catch (error: unknown) {
            let errorMsg = "Lỗi khi kiểm tra mật khẩu";
            if (axios.isAxiosError(error)) {
                errorMsg = error.response?.data?.error || error.message || errorMsg;
            }
            dispatch(checkPasswordFailure(errorMsg));
            throw new Error(errorMsg);
        }
    };
};

// ------------------------------
// 🔹 Thunk: Update user profile
// ------------------------------
export const updateProfile = (id: string, data: Partial<User>) => {
    return async (dispatch: Dispatch<UserActionTypes>): Promise<User> => {
        dispatch(fetchUserRequest());
        try {
            const response: AxiosResponse<{ data: User }> = await http.patch(
                `${API_ENDPOINT}${API_DATA.users}/${id}`,
                data
            );

            dispatch(fetchUserSuccess([response.data.data]));
            return response.data.data;
        } catch (error: unknown) {
            let errorMsg = "Lỗi khi cập nhật hồ sơ";
            if (axios.isAxiosError(error)) {
                errorMsg = error.response?.data?.message || error.message || errorMsg;
            }
            dispatch(fetchUserFailure(errorMsg));
            throw new Error(errorMsg);
        }
    };
};
