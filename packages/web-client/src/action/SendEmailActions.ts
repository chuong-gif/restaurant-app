import { API_DATA, API_ENDPOINT } from "../configs/APIs";
import http from "../Utils/Http";

// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_SEN_REQUEST = "FETCH_SEN_REQUEST";
export const FETCH_SEN_SUCCESS = "FETCH_SEN_SUCCESS";
export const FETCH_SEN_FAILURE = "FETCH_SEN_FAILURE";

// ------------------------------
// 🔹 Kiểu dữ liệu
// ------------------------------
export interface CustomerInfo {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    [key: string]: any;
}

export interface SendEmailResponse {
    success: boolean;
    message: string;
    [key: string]: any;
}

export interface SendEmailAction {
    type: string;
    payload?: any;
}

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchSenRequest = (): SendEmailAction => ({
    type: FETCH_SEN_REQUEST,
});

export const fetchSenSuccess = (response: SendEmailResponse): SendEmailAction => ({
    type: FETCH_SEN_SUCCESS,
    payload: response,
});

export const fetchSenFailure = (error: string): SendEmailAction => ({
    type: FETCH_SEN_FAILURE,
    payload: error,
});

// ------------------------------
// 🔹 Thunk: Gửi Email xác nhận đơn hàng
// ------------------------------
export const sendEmail = (
    dishes: any[],                // Danh sách món ăn
    dishList: any[],              // Chi tiết từng món
    customerInfo: CustomerInfo,   // Thông tin khách hàng
    currentTotal: number,         // Tổng tiền
    VAT10: number,                // Thuế 10%
    discount: number              // Giảm giá
) => {
    return async (dispatch: (action: SendEmailAction) => void) => {
        dispatch(fetchSenRequest());
        try {
            const response = await http.post<SendEmailResponse>(
                `${API_ENDPOINT}${API_DATA.sendEmail}`,
                {
                    dishes,
                    dishList,
                    customerInfo,
                    currentTotal,
                    VAT10,
                    discount,
                }
            );

            dispatch(fetchSenSuccess(response.data));
            return response.data; // ✅ Trả về response cho component
        } catch (err: unknown) {
            // ✅ Sửa lỗi TS18046 ('error' is of type 'unknown')
            const error = err as any;
            const errorMsg: string =
                error?.response?.data?.message || error?.message || "Đã xảy ra lỗi khi gửi email";
            dispatch(fetchSenFailure(errorMsg));
            throw new Error(errorMsg); // ✅ Ném lỗi để component bắt
        }
    };
};
