import axios, { type AxiosResponse } from "axios";
import { API_ENDPOINT, API_DATA } from "../configs/APIs";

// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_PROMOTION_REQUEST = 'FETCH_PROMOTION_REQUEST';
export const FETCH_PROMOTION_SUCCESS = 'FETCH_PROMOTION_SUCCESS';
export const FETCH_PROMOTION_FAILURE = 'FETCH_PROMOTION_FAILURE';

// ------------------------------
// 🔹 Kiểu dữ liệu
// ------------------------------
export interface Promotion {
    id: string;
    title: string;
    description?: string;
    discount?: number;
    [key: string]: any; // phòng trường hợp API trả thêm field khác
}

export interface PromotionAction {
    type: string;
    payload?: any;
}

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchPromotionRequest = (): PromotionAction => ({
    type: FETCH_PROMOTION_REQUEST
});

export const fetchPromotionSuccess = (promotions: Promotion[]): PromotionAction => ({
    type: FETCH_PROMOTION_SUCCESS,
    payload: promotions
});

export const fetchPromotionFailure = (error: string): PromotionAction => ({
    type: FETCH_PROMOTION_FAILURE,
    payload: error
});

// ------------------------------
// 🔹 Async Action - Fetch Promotions
// ------------------------------
export const fetchPromotion = () => {
    return async (dispatch: (action: PromotionAction) => void) => {
        dispatch(fetchPromotionRequest());
        try {
            const response: AxiosResponse<{ results: Promotion[] }> = await axios.get(
                `${API_ENDPOINT}${API_DATA.promotion}`
            );
            const promotions = response.data.results;
            dispatch(fetchPromotionSuccess(promotions));
            return promotions; // trả về dữ liệu cho component nếu cần
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || "Lỗi không xác định";
            dispatch(fetchPromotionFailure(errorMsg));
        }
    };
};
