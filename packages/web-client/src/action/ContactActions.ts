import type { ThunkAction } from "redux-thunk";
import type { AnyAction } from "redux";
import type { AxiosResponse, AxiosError } from "axios";
import { API_ENDPOINT, API_DATA } from "../configs/APIs";
import http from "../Utils/Http";
import type { RootState } from "../store"; // ✅ đảm bảo bạn có file store.ts

// ------------------------------
// 🔹 Kiểu dữ liệu
// ------------------------------
export interface Contact {
  id?: string;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
  [key: string]: any;
}

// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_CONTACT_REQUEST = "FETCH_CONTACT_REQUEST" as const;
export const FETCH_CONTACT_SUCCESS = "FETCH_CONTACT_SUCCESS" as const;
export const FETCH_CONTACT_FAILURE = "FETCH_CONTACT_FAILURE" as const;

// ------------------------------
// 🔹 Action Interfaces
// ------------------------------
export interface FetchContactRequestAction {
  type: typeof FETCH_CONTACT_REQUEST;
}

export interface FetchContactSuccessAction {
  type: typeof FETCH_CONTACT_SUCCESS;
  payload: Contact;
}

export interface FetchContactFailureAction {
  type: typeof FETCH_CONTACT_FAILURE;
  payload: string;
}

export type ContactAction =
  | FetchContactRequestAction
  | FetchContactSuccessAction
  | FetchContactFailureAction;

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchContactRequest = (): ContactAction => ({
  type: FETCH_CONTACT_REQUEST,
});

export const fetchContactSuccess = (contact: Contact): ContactAction => ({
  type: FETCH_CONTACT_SUCCESS,
  payload: contact,
});

export const fetchContactFailure = (error: string): ContactAction => ({
  type: FETCH_CONTACT_FAILURE,
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
// 🔹 Thunk Action: Thêm liên hệ mới
// ------------------------------
export const addNewContact =
  (contactData: Contact): AppThunk =>
  async (dispatch) => {
    dispatch(fetchContactRequest());
    try {
      const response: AxiosResponse<{ data: Contact }> = await http.post(
        `${API_ENDPOINT}${API_DATA.contact}`,
        contactData
      );
      dispatch(fetchContactSuccess(response.data.data));
    } catch (error) {
      const err = error as AxiosError;
      const errorMsg =
        (err.response?.data as any)?.message || err.message || "Failed to add contact";
      dispatch(fetchContactFailure(errorMsg));
    }
  };
