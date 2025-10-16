import { API_DATA, API_ENDPOINT } from "../Config/Client/APIs";
import http from "../Utils/Http";

// Action Types
export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export const CHECK_PASSWORD_REQUEST = 'CHECK_PASSWORD_REQUEST';
export const CHECK_PASSWORD_SUCCESS = 'CHECK_PASSWORD_SUCCESS';
export const CHECK_PASSWORD_FAILURE = 'CHECK_PASSWORD_FAILURE';

// Action Creators
export const fetchUserRequest = () => ({
    type: FETCH_USER_REQUEST
});

export const fetchUserSuccess = user => ({
    type: FETCH_USER_SUCCESS,
    payload: user
});

export const fetchUserFailure = error => ({
    type: FETCH_USER_FAILURE,
    payload: error
});

export const checkPasswordRequest = () => ({
    type: CHECK_PASSWORD_REQUEST
});

export const checkPasswordSuccess = message => ({
    type: CHECK_PASSWORD_SUCCESS,
    payload: message
});

export const checkPasswordFailure = error => ({
    type: CHECK_PASSWORD_FAILURE,
    payload: error
});

// Thunk: Fetch user list
export const fetchUser = () => {
    return async (dispatch) => {
        dispatch(fetchUserRequest());
        try {
            const response = await http.get(`${API_ENDPOINT}${API_DATA.users}`);
            const user = response.data.results;
            dispatch(fetchUserSuccess(user));
            return user; // Trả về dữ liệu để component dùng
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            dispatch(fetchUserFailure(errorMsg));
            throw new Error(errorMsg);
        }
    };
};

// Thunk: Check password
export const checkPassword = (email, currentPassword) => {
    return async (dispatch) => {
        dispatch(checkPasswordRequest());
        try {
            const response = await http.post(`${API_ENDPOINT}${API_DATA.checkPassword}`, { email, currentPassword });
            dispatch(checkPasswordSuccess(response.data.message));
            return response.data.message;
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message;
            dispatch(checkPasswordFailure(errorMsg));
            throw new Error(errorMsg);
        }
    };
};

// Thunk: Update user profile
export const updateProfile = (id, data) => {
    return async (dispatch) => {
        dispatch(fetchUserRequest());
        try {
            const response = await http.patch(`${API_ENDPOINT}${API_DATA.users}/${id}`, data);
            dispatch(fetchUserSuccess(response.data.data));
            return response.data.data;
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            dispatch(fetchUserFailure(errorMsg));
            throw new Error(errorMsg);
        }
    };
};
