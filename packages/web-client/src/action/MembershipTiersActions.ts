// Action Types
export const FETCH_MEMBERSHIP_TIERS_REQUEST = "FETCH_MEMBERSHIP_TIERS_REQUEST";
export const FETCH_MEMBERSHIP_TIERS_SUCCESS = "FETCH_MEMBERSHIP_TIERS_SUCCESS";
export const FETCH_MEMBERSHIP_TIERS_FAILURE = "FETCH_MEMBERSHIP_TIERS_FAILURE";

import { API_ENDPOINT, API_DATA } from "../Config/Client/APIs";
import http from "../Utils/Http";

// Action Creators
export const fetchMembershipTiersRequest = () => ({
    type: FETCH_MEMBERSHIP_TIERS_REQUEST
});

export const fetchMembershipTiersSuccess = (membership_tiers) => ({
    type: FETCH_MEMBERSHIP_TIERS_SUCCESS,
    payload: membership_tiers
});

export const fetchMembershipTiersFailure = (error) => ({
    type: FETCH_MEMBERSHIP_TIERS_FAILURE,
    payload: error
});

// Fetch danh sách tất cả các hạng thẻ thành viên
export const FetchAllListMemberShipTiers = () => {
    return async (dispatch) => {
        dispatch(fetchMembershipTiersRequest());
        try {
            const response = await http.get(`${API_ENDPOINT}/${API_DATA.membership_tiers}`);
            dispatch(fetchMembershipTiersSuccess(response.data.result));
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Lỗi khi gọi API";
            dispatch(fetchMembershipTiersFailure(errorMessage));
        }
    };
};

// Lấy cấp độ thành viên theo userId (không dispatch, trả trực tiếp)
export const FetchMembershipTier = async (userId) => {
    try {
        const response = await http.get(`${API_ENDPOINT}/${API_DATA.membership_tiers}/${userId}`);

        if (response.data) {
            const { tierName, userPoints } = response.data;
            return {
                tierName,
                userPoints,
                message: 'Lấy dữ liệu thành công'
            };
        } else {
            return { message: "Không tìm thấy cấp độ thành viên" };
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Lỗi khi gọi API";
        return { message: errorMessage };
    }
};
