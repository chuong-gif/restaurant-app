import { API_ENDPOINT, API_DATA } from "../configs/APIs";
import http from "../Utils/Http";

// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_MEMBERSHIP_TIERS_REQUEST = "FETCH_MEMBERSHIP_TIERS_REQUEST";
export const FETCH_MEMBERSHIP_TIERS_SUCCESS = "FETCH_MEMBERSHIP_TIERS_SUCCESS";
export const FETCH_MEMBERSHIP_TIERS_FAILURE = "FETCH_MEMBERSHIP_TIERS_FAILURE";

// ------------------------------
// 🔹 Interfaces
// ------------------------------
export interface MembershipTier {
    id: string;
    name: string;
    pointsRequired: number;
}

export interface MembershipTierResponse {
    result: MembershipTier[];
}

export interface MembershipTierDetail {
    tierName: string;
    userPoints: number;
    message: string;
}

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchMembershipTiersRequest = () => ({
    type: FETCH_MEMBERSHIP_TIERS_REQUEST as typeof FETCH_MEMBERSHIP_TIERS_REQUEST
});

export const fetchMembershipTiersSuccess = (membership_tiers: MembershipTier[]) => ({
    type: FETCH_MEMBERSHIP_TIERS_SUCCESS as typeof FETCH_MEMBERSHIP_TIERS_SUCCESS,
    payload: membership_tiers
});

export const fetchMembershipTiersFailure = (error: string) => ({
    type: FETCH_MEMBERSHIP_TIERS_FAILURE as typeof FETCH_MEMBERSHIP_TIERS_FAILURE,
    payload: error
});

// ------------------------------
// 🔹 Fetch danh sách tất cả các hạng thẻ thành viên
// ------------------------------
export const FetchAllListMemberShipTiers = () => {
    return async (dispatch: (action: any) => void): Promise<void> => {
        dispatch(fetchMembershipTiersRequest());
        try {
            const response = await http.get<MembershipTierResponse>(
                `${API_ENDPOINT}/${API_DATA.membership_tiers}`
            );
            dispatch(fetchMembershipTiersSuccess(response.data.result));
        } catch (error: unknown) {
            const errorMessage =
                (error as any)?.response?.data?.message || "Lỗi khi gọi API";
            dispatch(fetchMembershipTiersFailure(errorMessage));
        }
    };
};

// ------------------------------
// 🔹 Lấy cấp độ thành viên theo userId (không dispatch, trả trực tiếp)
// ------------------------------
export const FetchMembershipTier = async (
    userId: string
): Promise<MembershipTierDetail> => {
    try {
        const response = await http.get<{ tierName: string; userPoints: number }>(
            `${API_ENDPOINT}/${API_DATA.membership_tiers}/${userId}`
        );

        if (response.data) {
            const { tierName, userPoints } = response.data;
            return {
                tierName,
                userPoints,
                message: "Lấy dữ liệu thành công"
            };
        } else {
            return { tierName: "", userPoints: 0, message: "Không tìm thấy cấp độ thành viên" };
        }
    } catch (error: unknown) {
        const errorMessage =
            (error as any)?.response?.data?.message || "Lỗi khi gọi API";
        return { tierName: "", userPoints: 0, message: errorMessage };
    }
};
