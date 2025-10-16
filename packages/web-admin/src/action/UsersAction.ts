import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { API_ENDPOINT } from "../Config/APIs";
import AdminConfig from "../Config";
import http from "../Utils/Http";

// ------------------------------
// 🔹 Interfaces
// ------------------------------
export interface User {
  id: number;
  fullname: string;
  email: string;
  status: string;
  roleId?: number;
  userType?: string;
  [key: string]: any;
}

export interface UserState {
  loading: boolean;
  error: string | null;
  results: User[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

// ------------------------------
// 🔹 Initial State
// ------------------------------
const initialState: UserState = {
  loading: false,
  error: null,
  results: [],
  totalCount: 0,
  totalPages: 0,
  currentPage: 1,
  limit: parseInt(localStorage.getItem("limit") || "5", 10),
};

// ------------------------------
// 🔹 Async Thunks
// ------------------------------
export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (
    {
      fullname = "",
      status = "",
      searchRoleId = "",
      searchUserType = "",
      page = 1,
    }: {
      fullname?: string;
      status?: string;
      searchRoleId?: string;
      searchUserType?: string;
      page?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const limit = parseInt(localStorage.getItem("limit") || "5", 10);
      const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.users}`);
      if (fullname) url.searchParams.append("search", fullname);
      if (status) url.searchParams.append("searchStatus", status);
      if (searchUserType) url.searchParams.append("searchUserType", searchUserType);
      if (searchRoleId) url.searchParams.append("searchRoleId", searchRoleId);
      url.searchParams.append("page", String(page));
      url.searchParams.append("limit", String(limit));

      const response = await http.get(url.toString());
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await http.get(`${API_ENDPOINT}/${AdminConfig.routes.users}/${id}`);
      return response.data.result;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

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

export const addUser = createAsyncThunk(
  "users/add",
  async (user: Partial<User>, { dispatch, rejectWithValue }) => {
    try {
      await http.post(`${API_ENDPOINT}/${AdminConfig.routes.users}`, user);
      dispatch(fetchUsers({}));
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, data }: { id: number; data: Partial<User> }, { dispatch, rejectWithValue }) => {
    try {
      await http.patch(`${API_ENDPOINT}/${AdminConfig.routes.users}/${id}`, data);
      dispatch(fetchUsers({}));
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.users}/${id}`);
      dispatch(fetchUsers({}));
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ------------------------------
// 🔹 Slice
// ------------------------------
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      localStorage.setItem("limit", String(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.results = action.payload.results || [];
        state.totalCount = action.payload.totalCount || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.currentPage = action.payload.currentPage || 1;
      })
      .addCase(fetchUsers.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
      });
  },
});

export const { setCurrentPage, setLimit } = userSlice.actions;
export default userSlice.reducer;
