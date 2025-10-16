import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { API_ENDPOINT } from "../Config/APIs";
import AdminConfig from "../Config";
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
export const fetchTables = createAsyncThunk(
  "tables/fetchAll",
  async (
    {
      number = "",
      page = 1,
      searchCapacity = "",
      date = "",
    }: { number?: string; page?: number; searchCapacity?: string; date?: string },
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
      const error = err as AxiosError;
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchReservationDetails = createAsyncThunk(
  "tables/fetchReservationDetails",
  async (tableId: number, { rejectWithValue }) => {
    try {
      const response = await http.get(`${API_ENDPOINT}/${AdminConfig.routes.table}/${tableId}/reservations`);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addTable = createAsyncThunk(
  "tables/add",
  async (table: Partial<Table>, { dispatch, rejectWithValue }) => {
    try {
      await http.post(`${API_ENDPOINT}/${AdminConfig.routes.table}`, table);
      dispatch(fetchTables({}));
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTable = createAsyncThunk(
  "tables/update",
  async ({ id, data }: { id: number; data: Partial<Table> }, { dispatch, rejectWithValue }) => {
    try {
      await http.patch(`${API_ENDPOINT}/${AdminConfig.routes.table}/${id}`, data);
      dispatch(fetchTables({}));
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTable = createAsyncThunk(
  "tables/delete",
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.table}/${id}`);
      dispatch(fetchTables({}));
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ------------------------------
// 🔹 Slice
// ------------------------------
const tableSlice = createSlice({
  name: "tables",
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
      .addCase(fetchTables.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTables.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.results = action.payload.results || [];
        state.totalCount = action.payload.totalCount || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.currentPage = action.payload.currentPage || 1;
      })
      .addCase(fetchTables.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch tables";
      });
  },
});

export const { setCurrentPage, setLimit } = tableSlice.actions;
export default tableSlice.reducer;
