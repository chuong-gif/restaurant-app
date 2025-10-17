// src/store/slices/customerSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit"; // Tách PayloadAction ra đây
import api from "../../api/axiosInstance";

export interface Customer {
  id: number;
  fullname: string;
  email: string;
  phone?: string;
  [key: string]: any; // cho phép các field khác
}

export interface CustomerState {
  allCustomers: Customer[];
  customer: Customer[];
  currentPage: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  totalCount: number;
  totalPages: number;
}

// 🎯 initialState tương tự file Reducers cũ
const initialState: CustomerState = {
  allCustomers: [],
  customer: [],
  currentPage: 1,
  pageSize: 5,
  loading: false,
  error: null,
  totalCount: 0,
  totalPages: 0,
};

// 🧠 1. Fetch danh sách khách hàng
export const fetchCustomers = createAsyncThunk(
  "customers/fetch",
  async (
    { fullname = "", page = 1, pageSize = 5 }: { fullname?: string; page?: number; pageSize?: number },
    { rejectWithValue }
  ) => {
    try {
      const url = new URL("/customers", api.defaults.baseURL);
      if (fullname) url.searchParams.append("search", fullname);
      url.searchParams.append("page", String(page));
      url.searchParams.append("pageSize", String(pageSize));

      const res = await api.get(url.toString());
      return res.data; // { results, totalCount, totalPages, currentPage }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 🧠 2. Thêm khách hàng
export const addCustomer = createAsyncThunk(
  "customers/add",
  async (customer: Partial<Customer>, { dispatch, rejectWithValue }) => {
    try {
      await api.post("/customers", customer);
      dispatch(fetchCustomers({})); // reload list
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 🧠 3. Cập nhật khách hàng
export const updateCustomer = createAsyncThunk(
  "customers/update",
  async ({ id, data }: { id: number; data: Partial<Customer> }, { dispatch, rejectWithValue }) => {
    try {
      await api.patch(`/customers/${id}`, data);
      dispatch(fetchCustomers({}));
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 🧠 4. Xóa khách hàng
export const deleteCustomer = createAsyncThunk(
  "customers/delete",
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/customers/${id}`);
      dispatch(fetchCustomers({}));
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 🧠 5. Kiểm tra email tồn tại (API riêng, không cần Redux)
export const checkEmailExists = async (email: string) => {
  const res = await api.get("/auth/check-email", { params: { email } });
  return res.data.exists ? res.data.user : null;
};

// 🧩 Slice tổng hợp
const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    // tương đương SET_CURRENT_PAGE trong reducer cũ
    setCurrentPage(state, action: PayloadAction<number>) {
      const start = (action.payload - 1) * state.pageSize;
      const end = start + state.pageSize;
      state.currentPage = action.payload;
      state.customer = state.allCustomers.slice(start, end);
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.allCustomers = action.payload.results;
        state.totalCount = action.payload.totalCount;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.customer = action.payload.results.slice(0, state.pageSize);
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // ADD / UPDATE / DELETE
      .addCase(addCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentPage } = customerSlice.actions;
export default customerSlice.reducer;
