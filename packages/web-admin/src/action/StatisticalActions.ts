import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { AxiosResponse, AxiosError } from "axios";
import { API_ENDPOINT, API_DATA } from "../Config/APIs";
import http from "../Utils/Http";
import { RootState } from "../store"; // ⚠️ Cập nhật đúng đường dẫn store của bạn

// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_STATISTICAL_REQUEST = "FETCH_STATISTICAL_REQUEST" as const;
export const FETCH_STATISTICAL_SUCCESS = "FETCH_STATISTICAL_SUCCESS" as const;
export const FETCH_STATISTICAL_FAILURE = "FETCH_STATISTICAL_FAILURE" as const;

// ------------------------------
// 🔹 Interface cho dữ liệu Statistical
// ------------------------------
export interface StatisticalData {
  totalRevenue?: number;
  totalOrders?: number;
  totalUsers?: number;
  [key: string]: any; // Cho phép thêm các trường khác từ API
}

export interface StatisticalState {
  loading: boolean;
  data: StatisticalData | null;
  error: string | null;
}

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchStatisticalRequest = () => ({
  type: FETCH_STATISTICAL_REQUEST,
});

export const fetchStatisticalSuccess = (results: StatisticalData) => ({
  type: FETCH_STATISTICAL_SUCCESS,
  payload: results,
});

export const fetchStatisticalFailure = (error: string) => ({
  type: FETCH_STATISTICAL_FAILURE,
  payload: error,
});

// ------------------------------
// 🔹 Type Helper cho Redux Thunk
// ------------------------------
type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;

// ------------------------------
// 🔹 Fetch Statistical Data
// ------------------------------
export const fetchStatistical = (): AppThunk => async (dispatch) => {
  dispatch(fetchStatisticalRequest());
  try {
    const response: AxiosResponse<StatisticalData> = await http.get(
      `${API_ENDPOINT}${API_DATA.statistical}`
    );
    dispatch(fetchStatisticalSuccess(response.data));
  } catch (error) {
    const err = error as AxiosError;
    const message = err.message || "Không thể tải dữ liệu thống kê.";
    dispatch(fetchStatisticalFailure(message));
  }
};
