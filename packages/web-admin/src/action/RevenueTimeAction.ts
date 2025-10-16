import { API_ENDPOINT, API_DATA } from "../Config/APIs";
import http from "../Utils/Http";

// Action Types
export const FETCH_REVENUE_REQUEST = 'FETCH_REVENUE_REQUEST';
export const FETCH_REVENUE_SUCCESS = 'FETCH_REVENUE_SUCCESS';
export const FETCH_REVENUE_FAILURE = 'FETCH_REVENUE_FAILURE';

// Action Creators
export const fetchRevenueRequest = () => ({ type: FETCH_REVENUE_REQUEST });
export const fetchRevenueSuccess = (results) => ({ type: FETCH_REVENUE_SUCCESS, payload: results });
export const fetchRevenueFailure = (error) => ({ type: FETCH_REVENUE_FAILURE, payload: error });

// Fetch revenue data
export const fetchRevenue = (startDate, endDate) => {
    return async (dispatch) => {
        dispatch(fetchRevenueRequest());
        try {
            const response = await http.get(`${API_ENDPOINT}${API_DATA.statistical}/revenue`, {
                params: { startDate, endDate }
            });
            dispatch(fetchRevenueSuccess(response.data));
        } catch (error) {
            dispatch(fetchRevenueFailure(error.response?.data?.message || error.message));
        }
    };
};
