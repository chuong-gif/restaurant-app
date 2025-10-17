import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import { API_ENDPOINT } from "../configs/client/APIs";
import AdminConfig from "../configs/client/index";
import http from "../Utils/Http";

// ------------------------------
// 🔹 Interfaces
// ------------------------------
export interface Table {
  id: number;
  number: string;
  capacity: number;
  status: string;
  [key: string]: any;
}

export interface TableState {
  loading: boolean;
  error: string | null;
  results: Table[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

// ------------------------------
// 🔹 Initial State
// ------------------------------
const initialState: TableState = {
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
export const fetchTables = createAsyncThunk<
  any, // kiểu dữ liệu trả về
  { number?: string; page?: number; searchCapacity?: string; date?: string },
  { rejectValue: string }
>(
  "tables/fetchAll",
  async (
    { number = "", page = 1, searchCapacity = "", date = "" },
    { rejectWithValue }
  ) => {
    try {
      const limit = parseInt(localStorage.getItem("limit") || "5", 10);
      const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.table}/filter-by-date`);
      if (number) url.searchParams.append("search", number);
      if (searchCapacity) url.searchParams.append("searchCapacity", searchCapacity);
      if (date) url.searchParams.append("date", date);
      url.searchParams.append("page", String(page));
      url.searchParams.append("limit", String(limit));

      const response = await http.get(url.toString());
      return response.data;
    } catch (err) {
      const error = err as AxiosError<any>;
      return rejectWithValue(error.response?.data?.message || error.message || "Lỗi tải dữ liệu bàn");
    }
  }
);

export const fetchReservationDetails = createAsyncThunk<
  any,
  number,
  { rejectValue: string }
>("tables/fetchReservationDetails", async (tableId, { rejectWithValue }) => {
  try {
    const response = await http.get(`${API_ENDPOINT}/${AdminConfig.routes.table}/${tableId}/reservations`);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    return rejectWithValue(error.response?.data?.message || error.message || "Lỗi tải chi tiết đặt bàn");
  }
});

export const addTable = createAsyncThunk<
  void,
  Partial<Table>,
  { dispatch: any; rejectValue: string }
>("tables/add", async (table, { dispatch, rejectWithValue }) => {
  try {
    await http.post(`${API_ENDPOINT}/${AdminConfig.routes.table}`, table);
    dispatch(fetchTables({}));
  } catch (err) {
    const error = err as AxiosError<any>;
    return rejectWithValue(error.response?.data?.message || error.message || "Lỗi thêm bàn");
  }
});

export const updateTable = createAsyncThunk<
  void,
  { id: number; data: Partial<Table> },
  { dispatch: any; rejectValue: string }
>("tables/update", async ({ id, data }, { dispatch, rejectWithValue }) => {
  try {
    await http.patch(`${API_ENDPOINT}/${AdminConfig.routes.table}/${id}`, data);
    dispatch(fetchTables({}));
  } catch (err) {
    const error = err as AxiosError<any>;
    return rejectWithValue(error.response?.data?.message || error.message || "Lỗi cập nhật bàn");
  }
});

export const deleteTable = createAsyncThunk<
  void,
  number,
  { dispatch: any; rejectValue: string }
>("tables/delete", async (id, { dispatch, rejectWithValue }) => {
  try {
    await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.table}/${id}`);
    dispatch(fetchTables({}));
  } catch (err) {
    const error = err as AxiosError<any>;
    return rejectWithValue(error.response?.data?.message || error.message || "Lỗi xóa bàn");
  }
});

// ------------------------------
// 🔹 Slice
// ------------------------------
const tableSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {
    setCurrentPage: (state: TableState, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setLimit: (state: TableState, action: PayloadAction<number>) => {
      state.limit = action.payload;
      localStorage.setItem("limit", String(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTables.pending, (state: TableState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTables.fulfilled, (state: TableState, action: PayloadAction<any>) => {
        state.loading = false;
        state.results = action.payload.results || [];
        state.totalCount = action.payload.totalCount || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.currentPage = action.payload.currentPage || 1;
      })
      .addCase(fetchTables.rejected, (state: TableState, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Không thể tải danh sách bàn";
      });
  },
});

export const { setCurrentPage, setLimit } = tableSlice.actions;
export default tableSlice.reducer;
