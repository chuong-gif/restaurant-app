export const FETCH_USERS_REQUEST = "FETCH_USERS_REQUEST";
export const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";
export const FETCH_USERS_FAILURE = "FETCH_USERS_FAILURE";
export const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";
export const SET_LIMIT = "SET_LIMIT";

import { API_ENDPOINT } from "../Config/APIs";
import AdminConfig from "../Config";
import http from "../Utils/Http";

export interface User {
  id?: number;
  fullname?: string;
  email?: string;
  status?: string;
  roleId?: string;
  userType?: string;
  [key: string]: any;
}

export interface FetchUserSuccessPayload {
  results: User[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export const fetchUserRequest = () => ({
  type: FETCH_USERS_REQUEST,
});

export const fetchUserSuccess = (payload: FetchUserSuccessPayload) => ({
  type: FETCH_USERS_SUCCESS,
  payload,
});

export const fetchUserFailure = (error: string) => ({
  type: FETCH_USERS_FAILURE,
  payload: error,
});

export const setCurrentPage = (page: number) => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});

export const setLimit = (limit: number) => ({
  type: SET_LIMIT,
  payload: limit,
});

export const fetchUsers =
  (
    fullname = "",
    status = "",
    searchRoleId = "",
    searchUserType = "",
    page = 1
  ) =>
  async (dispatch: any) => {
    dispatch(fetchUserRequest());
    const limit = parseInt(localStorage.getItem("limit") || "5", 10);

    try {
      const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.users}`);
      if (fullname) url.searchParams.append("search", fullname);
      if (status) url.searchParams.append("searchStatus", status);
      if (searchUserType) url.searchParams.append("searchUserType", searchUserType);
      if (searchRoleId) url.searchParams.append("searchRoleId", searchRoleId);
      url.searchParams.append("page", page.toString());
      url.searchParams.append("limit", limit.toString());

      const response = await http.get(url.toString());
      const { results, totalCount, totalPages, currentPage } = response.data;

      dispatch(fetchUserSuccess({ results, totalCount, totalPages, currentPage }));
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || error.message || "Failed to fetch users";
      dispatch(fetchUserFailure(errorMsg));
    }
  };

export const fetchUserById =
  (id: number) => async (dispatch: any): Promise<User> => {
    dispatch(fetchUserRequest());
    try {
      const response = await http.get(`${API_ENDPOINT}/${AdminConfig.routes.users}/${id}`);
      const user = response.data.result;
      dispatch(
        fetchUserSuccess({
          results: [user],
          totalCount: 1,
          totalPages: 1,
          currentPage: 1,
        })
      );
      return user;
    } catch (error: any) {
      const errorMsg = error.message;
      dispatch(fetchUserFailure(errorMsg));
      throw error;
    }
  };

export const checkEmailExists = async (email: string) => {
  try {
    const response = await http.post(
      `${API_ENDPOINT}/${AdminConfig.routes.users}/check-email-exists`,
      { email }
    );
    return response.data.exists ? response.data.user : null;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw error;
  }
};

export const addUser =
  (user: User) => async (dispatch: any): Promise<void> => {
    dispatch(fetchUserRequest());
    try {
      await http.post(`${API_ENDPOINT}/${AdminConfig.routes.users}`, user);
      dispatch(fetchUsers());
    } catch (error: any) {
      const errorMsg = error.message;
      dispatch(fetchUserFailure(errorMsg));
      throw new Error(errorMsg);
    }
  };

export const updateUser =
  (id: number, data: Partial<User>) => async (dispatch: any): Promise<void> => {
    dispatch(fetchUserRequest());
    try {
      await http.patch(`${API_ENDPOINT}/${AdminConfig.routes.users}/${id}`, data);
      dispatch(fetchUsers());
    } catch (error: any) {
      const errorMsg = error.message;
      dispatch(fetchUserFailure(errorMsg));
      throw new Error(errorMsg);
    }
  };

export const deleteUsers =
  (id: number) => async (dispatch: any): Promise<void> => {
    dispatch(fetchUserRequest());
    try {
      await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.users}/${id}`);
      dispatch(fetchUsers());
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error || "Đã xảy ra lỗi khi xóa tài khoản";
      dispatch(fetchUserFailure(errorMsg));
      throw new Error(errorMsg);
    }
  };
