import { API_DATA, API_ENDPOINT } from "../Config/Client/APIs";
import http from "../Utils/Http";

// Action Types
export const FETCH_SEN_REQUEST = "FETCH_SEN_REQUEST";
export const FETCH_SEN_SUCCESS = "FETCH_SEN_SUCCESS";
export const FETCH_SEN_FAILURE = "FETCH_SEN_FAILURE";

// Action Creators
export const fetchSenRequest = () => ({
    type: FETCH_SEN_REQUEST,
});

export const fetchSenSuccess = (response) => ({
    type: FETCH_SEN_SUCCESS,
    payload: response,
});

export const fetchSenFailure = (error) => ({
    type: FETCH_SEN_FAILURE,
    payload: error,
});

// Thunk to send email
export const sendEmail = (dishes, dishList, customerInfo, currentTotal, VAT10, discount) => {
    return async (dispatch) => {
        dispatch(fetchSenRequest());
        try {
            const response = await http.post(`${API_ENDPOINT}${API_DATA.sendEmail}`, {
                dishes,
                dishList,
                customerInfo,
                currentTotal,
                VAT10,
                discount
            });

            dispatch(fetchSenSuccess(response.data));
            return response.data; // Trả về response để component xử lý tiếp
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi khi gửi email";
            dispatch(fetchSenFailure(errorMsg));
            throw new Error(errorMsg); // Ném lỗi để component có thể bắt
        }
    };
};
