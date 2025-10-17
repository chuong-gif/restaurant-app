// -----------------------------------------
// PromotionActions.ts
// -----------------------------------------

// Action Types
export const FETCH_PROMOTION_REQUEST = 'FETCH_PROMOTION_REQUEST';
export const FETCH_PROMOTION_SUCCESS = 'FETCH_PROMOTION_SUCCESS';
export const FETCH_PROMOTION_FAILURE = 'FETCH_PROMOTION_FAILURE';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const SET_LIMIT = 'SET_LIMIT';

import { API_ENDPOINT } from "../configs/client/APIs";
import AdminConfig from '../configs/client/index';
import http from "../Utils/Http";

import type { ThunkDispatch } from "redux-thunk";
import type { AnyAction } from "redux";
import type { AxiosError } from "axios";

// -----------------------------------------
// Types
// -----------------------------------------
export interface Promotion {
  id?: number | string;
  code_name?: string;
  description?: string;
  discount?: number;
  start_date?: string;
  end_date?: string;
  status?: string;
  [key: string]: any;
}

export interface PromotionResponse {
  results: Promotion[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

// Thunk dispatch type (nếu bạn có RootState, thay `any` bằng RootState)
export type AppDispatch = ThunkDispatch<any, any, AnyAction>;

// -----------------------------------------
// Action Creators
// -----------------------------------------
export const fetchPromotionRequest = () => ({
  type: FETCH_PROMOTION_REQUEST as typeof FETCH_PROMOTION_REQUEST,
});

export const fetchPromotionSuccess = (
  results: Promotion[],
  totalCount: number = 0,
  totalPages: number = 0,
  currentPage: number = 1
) => ({
  type: FETCH_PROMOTION_SUCCESS as typeof FETCH_PROMOTION_SUCCESS,
  payload: { results, totalCount, totalPages, currentPage },
});

export const fetchPromotionsFailure = (error: string) => ({
  type: FETCH_PROMOTION_FAILURE as typeof FETCH_PROMOTION_FAILURE,
  payload: error,
});

export const setCurrentPage = (page: number) => ({
  type: SET_CURRENT_PAGE as typeof SET_CURRENT_PAGE,
  payload: page,
});

export const setLimit = (limit: number) => ({
  type: SET_LIMIT as typeof SET_LIMIT,
  payload: limit,
});

// -----------------------------------------
// Thunks
// -----------------------------------------

// Hàm chung fetch promotions
const fetchPromotionAPI =
  (code_name: string = '', page: number = 1, pageSize: number = 10) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(fetchPromotionRequest());
    try {
      const limit = parseInt(localStorage.getItem('limit') ?? `${pageSize}`, 10);
      const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.promotion}`);
      if (code_name) url.searchParams.append('search', code_name);
      url.searchParams.append('page', String(page));
      url.searchParams.append('limit', String(limit));

      const response = await http.get<PromotionResponse>(url.toString());
      const { results, totalCount, totalPages, currentPage } = response.data;
      dispatch(fetchPromotionSuccess(results, totalCount, totalPages, currentPage));
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      const errMsg = error?.response?.data?.message || error?.message || "Unknown error";
      dispatch(fetchPromotionsFailure(errMsg));
    }
  };

// Fetch tất cả promotion
export const fetchPromotion = (code_name = '', page = 1, pageSize = 10) =>
  fetchPromotionAPI(code_name, page, pageSize);

// Add promotion
export const addPromotion =
  (promotion: Promotion) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(fetchPromotionRequest());
    try {
      await http.post(`${API_ENDPOINT}/${AdminConfig.routes.promotion}`, promotion);
      // reload danh sách
      dispatch(fetchPromotion());
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      const errMsg = error?.response?.data?.message || error?.message || "Unknown error";
      dispatch(fetchPromotionsFailure(errMsg));
    }
  };

// Update promotion
export const updatePromotions =
  (id: number | string, data: Partial<Promotion>) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(fetchPromotionRequest());
    try {
      await http.patch(`${API_ENDPOINT}/${AdminConfig.routes.promotion}/${id}`, data);
      // reload danh sách
      dispatch(fetchPromotion());
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      const errMsg = error?.response?.data?.message || error?.message || "Unknown error";
      dispatch(fetchPromotionsFailure(errMsg));
    }
  };

// Delete promotion
export const deletePromotion =
  (id: number | string, code_name = '', page = 1, pageSize = 10) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(fetchPromotionRequest());
    try {
      await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.promotion}/${id}`);
      // reload danh sách
      dispatch(fetchPromotion(code_name, page, pageSize));
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      const errMsg = error?.response?.data?.message || error?.message || "Unknown error";
      dispatch(fetchPromotionsFailure(errMsg));
      // giữ hành vi ban đầu: ném lỗi để component bắt
      throw new Error(errMsg);
    }
  };
