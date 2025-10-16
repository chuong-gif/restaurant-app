import axios from "axios";
import { API_ENDPOINT, API_DATA } from "../Config/Client/APIs";

// Action Types
export const FETCH_PROMOTION_REQUEST = 'FETCH_PROMOTION_REQUEST';
export const FETCH_PROMOTION_SUCCESS = 'FETCH_PROMOTION_SUCCESS';
export const FETCH_PROMOTION_FAILURE = 'FETCH_PROMOTION_FAILURE';

// Action Creators
export const fetchPromotionRequest = () => ({
    type: FETCH_PROMOTION_REQUEST
});

export const fetchPromotionSuccess = (promotions) => ({
    type: FETCH_PROMOTION_SUCCESS,
    payload: promotions
});

export const fetchPromotionFailure = (error) => ({
    type: FETCH_PROMOTION_FAILURE,
    payload: error
});

// Fetch all promotions
export const fetchPromotion = () => {
    return (dispatch) => {
        dispatch(fetchPromotionRequest());
        return axios.get(`${API_ENDPOINT}${API_DATA.promotion}`)
            .then(response => {
                const promotions = response.data.results;
                dispatch(fetchPromotionSuccess(promotions));
                return promotions; // trả về dữ liệu cho component nếu cần
            })
            .catch(error => {
                const errorMsg = error.response?.data?.message || error.message;
                dispatch(fetchPromotionFailure(errorMsg));
            });
    };
};
