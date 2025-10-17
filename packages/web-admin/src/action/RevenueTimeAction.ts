// src/action/RevenueTimeAction.ts
import { API_ENDPOINT, API_DATA } from "../configs/client/APIs";
import http from "../Utils/Http";

import type { ThunkDispatch } from "redux-thunk";
import type { AnyAction } from "redux";
import type { AxiosError } from "axios";

// -----------------------------
// Action Types
// -----------------------------
export const FETCH_REVENUE_REQUEST = "FETCH_REVENUE_REQUEST";
export const FETCH_REVENUE_SUCCESS = "FETCH_REVENUE_SUCCESS";
export const FETCH_REVENUE_FAILURE = "FETCH_REVENUE_FAILURE";

// (Optional) If you want to store reservation detail in Redux, you can define types:
// export const FETCH_RESERVATION_DETAIL_REQUEST = "FETCH_RESERVATION_DETAIL_REQUEST";
// export const FETCH_RESERVATION_DETAIL_SUCCESS = "FETCH_RESERVATION_DETAIL_SUCCESS";
// export const FETCH_RESERVATION_DETAIL_FAILURE = "FETCH_RESERVATION_DETAIL_FAILURE";

export type AppDispatch = ThunkDispatch<any, any, AnyAction>;

// -----------------------------
// Action Creators (Revenue)
// -----------------------------
export const fetchRevenueRequest = () => ({ type: FETCH_REVENUE_REQUEST });
export const fetchRevenueSuccess = (results: any) => ({ type: FETCH_REVENUE_SUCCESS, payload: results });
export const fetchRevenueFailure = (error: string) => ({ type: FETCH_REVENUE_FAILURE, payload: error });

// -----------------------------
// Thunk: Fetch revenue data
// -----------------------------
export const fetchRevenue = (startDate?: string, endDate?: string) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(fetchRevenueRequest());
    try {
      const response = await http.get(`${API_ENDPOINT}${API_DATA.statistical}/revenue`, {
        params: { startDate, endDate },
      });
      dispatch(fetchRevenueSuccess(response.data));
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      const msg = error.response?.data?.message || error.message || "Lỗi không xác định";
      dispatch(fetchRevenueFailure(msg));
    }
  };
};

// -----------------------------
// Thunk: Fetch reservation detail
// (Thêm vào để resolve import từ Reservations_t_AdminActions)
// -----------------------------
// Ghi chú: endpoint dưới đây giả định chi tiết reservation có thể lấy tại:
// `${API_ENDPOINT}/${API_DATA.reservations_admin}/${id}`
// Nếu backend khác, hãy chỉnh URL cho đúng.
export const fetchReservationdetail = (id: number | string) => {
  return async (): Promise<any> => {
    // Nếu bạn muốn dispatch action khi bắt đầu/hoàn thành, thêm dispatch ở đây.
    // Ví dụ: dispatch({ type: FETCH_RESERVATION_DETAIL_REQUEST });
    try {
      const url = `${API_ENDPOINT}/${API_DATA.reservations_admin}/${id}`;
      const response = await http.get(url);
      // Nếu bạn muốn lưu detail vào redux, dispatch một action ở đây.
      // ex: dispatch({ type: FETCH_RESERVATION_DETAIL_SUCCESS, payload: response.data });
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      const msg = error.response?.data?.message || error.message || "Lỗi không xác định";
      // Nếu bạn có action failure cho detail, dispatch nó ở đây.
      // ex: dispatch({ type: FETCH_RESERVATION_DETAIL_FAILURE, payload: msg });
      // Trả/rethrow lỗi để caller biết
      throw new Error(msg);
    }
  };
};
