import type { ThunkAction } from "redux-thunk";
import type { AnyAction } from "redux";
import type { AxiosResponse, AxiosError } from "axios";
import { API_ENDPOINT, API_DATA } from "../configs/APIs";
import http from "../Utils/Http";
import type { RootState } from "../store"; // ✅ import kiểu RootState nếu đã có store.ts

// ------------------------------
// 🔹 Kiểu dữ liệu thẻ thành viên
// ------------------------------
export interface Membership {
  id: string;
  userId: string;
  level: string;
  points: number;
  expiryDate?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_MEMBERSHIP_REQUEST = "FETCH_MEMBERSHIP_REQUEST" as const;
export const FETCH_MEMBERSHIP_SUCCESS = "FETCH_MEMBERSHIP_SUCCESS" as const;
export const FETCH_MEMBERSHIP_FAILURE = "FETCH_MEMBERSHIP_FAILURE" as const;

// ------------------------------
// 🔹 Action Interfaces
// ------------------------------
export interface FetchMembershipRequestAction {
  type: typeof FETCH_MEMBERSHIP_REQUEST;
}

export interface FetchMembershipSuccessAction {
  type: typeof FETCH_MEMBERSHIP_SUCCESS;
  payload: Membership;
}

export interface FetchMembershipFailureAction {
  type: typeof FETCH_MEMBERSHIP_FAILURE;
  payload: string;
}

export type MembershipAction =
  | FetchMembershipRequestAction
  | FetchMembershipSuccessAction
  | FetchMembershipFailureAction;

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchMembershipRequest = (): MembershipAction => ({
  type: FETCH_MEMBERSHIP_REQUEST,
});

export const fetchMembershipSuccess = (
  membership: Membership
): MembershipAction => ({
  type: FETCH_MEMBERSHIP_SUCCESS,
  payload: membership,
});

export const fetchMembershipFailure = (error: string): MembershipAction => ({
  type: FETCH_MEMBERSHIP_FAILURE,
  payload: error,
});

// ------------------------------
// 🔹 Kiểu Redux Thunk
// ------------------------------
type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;

// ------------------------------
// 🔹 Fetch thông tin thẻ thành viên theo userId
// ------------------------------
export const FetchInfoMembershipCard =
  (userId: string): AppThunk =>
  async (dispatch) => {
    dispatch(fetchMembershipRequest());
    try {
      const response: AxiosResponse<{ result: Membership }> = await http.get(
        `${API_ENDPOINT}/${API_DATA.membership}/${userId}`
      );
      dispatch(fetchMembershipSuccess(response.data.result));
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage =
        err.response?.data?.message || err.message || "Lỗi khi gọi API";
      dispatch(fetchMembershipFailure(errorMessage));
    }
  };
