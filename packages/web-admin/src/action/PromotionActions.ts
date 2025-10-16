// Action Types
export const FETCH_PROMOTION_REQUEST = 'FETCH_PROMOTION_REQUEST';
export const FETCH_PROMOTION_SUCCESS = 'FETCH_PROMOTION_SUCCESS';
export const FETCH_PROMOTION_FAILURE = 'FETCH_PROMOTION_FAILURE';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const SET_LIMIT = 'SET_LIMIT';

import { API_ENDPOINT } from "../Config/APIs";
import AdminConfig from '../Config/index';
import http from "../Utils/Http";

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchPromotionRequest = () => ({ type: FETCH_PROMOTION_REQUEST });
export const fetchPromotionSuccess = (results, totalCount = 0, totalPages = 0, currentPage = 1) => ({
    type: FETCH_PROMOTION_SUCCESS,
    payload: { results, totalCount, totalPages, currentPage }
});
export const fetchPromotionsFailure = (error) => ({ type: FETCH_PROMOTION_FAILURE, payload: error });
export const setCurrentPage = (page) => ({ type: SET_CURRENT_PAGE, payload: page });
export const setLimit = (limit) => ({ type: SET_LIMIT, payload: limit });

// ------------------------------
// 🔹 Thunks
// ------------------------------

// Hàm chung fetch promotions
const fetchPromotionAPI = (code_name = '', page = 1, pageSize = 10) => {
    return async dispatch => {
        dispatch(fetchPromotionRequest());
        try {
            const limit = parseInt(localStorage.getItem('limit'), 10) || pageSize;
            const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.promotion}`);
            if (code_name) url.searchParams.append('search', code_name);
            url.searchParams.append('page', page);
            url.searchParams.append('limit', limit);

            const response = await http.get(url.toString());
            const { results, totalCount, totalPages, currentPage } = response.data;
            dispatch(fetchPromotionSuccess(results, totalCount, totalPages, currentPage));
        } catch (error) {
            dispatch(fetchPromotionsFailure(error.response?.data?.message || error.message));
        }
    };
};

// Fetch tất cả promotion
export const fetchPromotion = (code_name = '', page = 1, pageSize = 10) =>
    fetchPromotionAPI(code_name, page, pageSize);

// Add promotion
export const addPromotion = (promotion) => {
    return async dispatch => {
        dispatch(fetchPromotionRequest());
        try {
            await http.post(`${API_ENDPOINT}/${AdminConfig.routes.promotion}`, promotion);
            dispatch(fetchPromotion()); // reload danh sách
        } catch (error) {
            dispatch(fetchPromotionsFailure(error.response?.data?.message || error.message));
        }
    };
};

// Update promotion
export const updatePromotions = (id, data) => {
    return async dispatch => {
        dispatch(fetchPromotionRequest());
        try {
            await http.patch(`${API_ENDPOINT}/${AdminConfig.routes.promotion}/${id}`, data);
            dispatch(fetchPromotion()); // reload danh sách
        } catch (error) {
            dispatch(fetchPromotionsFailure(error.response?.data?.message || error.message));
        }
    };
};

// Delete promotion
export const deletePromotion = (id, code_name = '', page = 1, pageSize = 10) => {
    return async dispatch => {
        dispatch(fetchPromotionRequest());
        try {
            await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.promotion}/${id}`);
            dispatch(fetchPromotion(code_name, page, pageSize)); // reload danh sách
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            dispatch(fetchPromotionsFailure(errorMsg));
            throw new Error(errorMsg); // Throw lỗi để component bắt
        }
    };
};
