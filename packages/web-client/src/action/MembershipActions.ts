// Action Types
export const FETCH_MEMBERSHIP_REQUEST = "FETCH_MEMBERSHIP_REQUEST";
export const FETCH_MEMBERSHIP_SUCCESS = "FETCH_MEMBERSHIP_SUCCESS";
export const FETCH_MEMBERSHIP_FAILURE = "FETCH_MEMBERSHIP_FAILURE";

import { API_ENDPOINT, API_DATA } from "../Config/Client/APIs";
import http from "../Utils/Http";

// Action Creators
export const fetchMembershipRequest = () => ({
    type: FETCH_MEMBERSHIP_REQUEST
});

export const fetchMembershipSuccess = (membership) => ({
    type: FETCH_MEMBERSHIP_SUCCESS,
    payload: membership
});

export const fetchMembershipFailure = (error) => ({
    type: FETCH_MEMBERSHIP_FAILURE,
    payload: error
});

// Fetch thông tin thẻ thành viên theo userId
export const FetchInfoMembershipCard = (userId) => {
    return async (dispatch) => {
        dispatch(fetchMembershipRequest());
        try {
            const response = await http.get(`${API_ENDPOINT}/${API_DATA.membership}/${userId}`);
            dispatch(fetchMembershipSuccess(response.data.result));
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Lỗi khi gọi API";
            dispatch(fetchMembershipFailure(errorMessage));
        }
    };
};
