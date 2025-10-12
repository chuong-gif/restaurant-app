import { Dispatch } from "redux";
import { API_DATA, API_ENDPOINT } from "../Config/Client/APIs";
import http from "../Utils/Http";

// Action types
export const FETCH_AUTH_REQUEST = "FETCH_AUTH_REQUEST";
export const FETCH_AUTH_SUCCESS = "FETCH_AUTH_SUCCESS";
export const FETCH_AUTH_FAILURE = "FETCH_AUTH_FAILURE";
export const SHOW_SUCCESS_ALERT = "SHOW_SUCCESS_ALERT";
export const SHOW_ERROR_ALERT = "SHOW_ERROR_ALERT";
export const CHECK_AUTH_STATUS = "CHECK_AUTH_STATUS";

// ==========================
// 🔹 Interface & Type Declarations
// ==========================

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    [key: string]: any; // phòng khi có thêm field khác từ API
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    message?: string;
}

export interface AuthError {
    message: string;
}

// ==========================
// 🔹 Redux Action Creators
// ==========================
export const fetchAuthRequest = () => ({
    type: FETCH_AUTH_REQUEST as typeof FETCH_AUTH_REQUEST,
});

export const fetchAuthSuccess = (auth: AuthResponse) => ({
    type: FETCH_AUTH_SUCCESS as typeof FETCH_AUTH_SUCCESS,
    payload: auth,
});

export const fetchAuthFailure = (error: string) => ({
    type: FETCH_AUTH_FAILURE as typeof FETCH_AUTH_FAILURE,
    payload: error,
});

export const showSuccessAlert = (message: string) => ({
    type: SHOW_SUCCESS_ALERT as typeof SHOW_SUCCESS_ALERT,
    payload: message,
});

export const showErrorAlert = (message: string) => ({
    type: SHOW_ERROR_ALERT as typeof SHOW_ERROR_ALERT,
    payload: message,
});

const getErrorMessage = (error: any): string => {
    return error?.response?.data?.message || error.message || "Đã xảy ra lỗi. Vui lòng thử lại!";
};

// ==========================
// 🔹 API Actions (Async Thunks)
// ==========================

// Kiểm tra email tồn tại
export const checkEmailExists = async (email: string): Promise<User | null> => {
    try {
        const response = await http.get(`${API_ENDPOINT}/auth/check-email`, { params: { email } });
        return response.data.exists ? response.data.user : null;
    } catch (error) {
        console.error("Error checking user existence:", error);
        throw error;
    }
};

// Đăng nhập Google
export const fetchGoogleAuth = (userData: object) => {
    return async (dispatch: Dispatch) => {
        dispatch(fetchAuthRequest());
        try {
            const response = await http.post<AuthResponse>(`${API_ENDPOINT}${API_DATA.authOGoogle}`, userData);
            const data = response.data;

            dispatch(fetchAuthSuccess(data));
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("accessToken", data.accessToken);
            dispatch(showSuccessAlert("Đăng nhập Google thành công!"));
        } catch (error: any) {
            const errorMsg = getErrorMessage(error);
            dispatch(fetchAuthFailure(errorMsg));
            dispatch(showErrorAlert(errorMsg));
        }
    };
};

// Đăng nhập Facebook
export const fetchFacebookAuth = (userData: object) => {
    return async (dispatch: Dispatch) => {
        dispatch(fetchAuthRequest());
        try {
            const response = await http.post<AuthResponse>(`${API_ENDPOINT}${API_DATA.authOFacebook}`, userData);
            const data = response.data;

            dispatch(fetchAuthSuccess(data));
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("accessToken", data.accessToken);
            dispatch(showSuccessAlert("Đăng nhập Facebook thành công!"));
        } catch (error: any) {
            const errorMsg = getErrorMessage(error);
            dispatch(fetchAuthFailure(errorMsg));
            dispatch(showErrorAlert(errorMsg));
        }
    };
};

// Đăng nhập thường
export const fetchLogin = (email: string, password: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(fetchAuthRequest());
        try {
            const response = await http.post<AuthResponse>(`${API_ENDPOINT}${API_DATA.login}`, { email, password });
            const data = response.data;

            dispatch(fetchAuthSuccess(data));
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("accessToken", data.accessToken);
            dispatch(showSuccessAlert("Đăng nhập thành công!"));
        } catch (error: any) {
            const errorMsg = getErrorMessage(error);
            dispatch(fetchAuthFailure(errorMsg));
            dispatch(showErrorAlert(errorMsg));
        }
    };
};

// Kiểm tra trạng thái đăng nhập
export const checkAuthStatus = () => {
    return (dispatch: Dispatch) => {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("accessToken");

        if (user && token) {
            dispatch({
                type: CHECK_AUTH_STATUS,
                payload: { isAuthenticated: true, user: JSON.parse(user) },
            });
        } else {
            dispatch({
                type: CHECK_AUTH_STATUS,
                payload: { isAuthenticated: false, user: null },
            });
        }
    };
};

// Đăng ký tài khoản
export const addNewCustomer = (customerData: object) => {
    return async (dispatch: Dispatch) => {
        dispatch(fetchAuthRequest());
        try {
            const response = await http.post<AuthResponse>(`${API_ENDPOINT}${API_DATA.register}`, customerData);
            const data = response.data;

            dispatch(fetchAuthSuccess(data));
            dispatch(showSuccessAlert("Đăng ký tài khoản thành công!"));
        } catch (error: any) {
            const errorMsg = getErrorMessage(error);
            dispatch(fetchAuthFailure(errorMsg));
            dispatch(showErrorAlert(errorMsg));
        }
    };
};

// Quên mật khẩu
export const forgotPassword = (email: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(fetchAuthRequest());
        try {
            const response = await http.post(`${API_ENDPOINT}${API_DATA.forgotPassword}`, { email });
            dispatch(fetchAuthSuccess(response.data));
            dispatch(showSuccessAlert("Email đặt lại mật khẩu đã được gửi thành công!"));
        } catch (error: any) {
            const errorMsg = getErrorMessage(error);
            dispatch(fetchAuthFailure(errorMsg));
            dispatch(showErrorAlert(errorMsg));
        }
    };
};

// Đổi mật khẩu
export const changePassword = (token: string, newPassword: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(fetchAuthRequest());
        try {
            const response = await http.post(`${API_ENDPOINT}${API_DATA.changePassword}`, { token, newPassword });
            dispatch(fetchAuthSuccess(response.data));
            dispatch(showSuccessAlert("Đổi mật khẩu thành công!"));
        } catch (error: any) {
            const errorMsg = getErrorMessage(error);
            dispatch(fetchAuthFailure(errorMsg));
            dispatch(showErrorAlert(errorMsg));
        }
    };
};
