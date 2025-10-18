import { fetchTables } from "../action/TablesActions"; // async thunk

// ------------------------------
// 🔹 Interface Table
// ------------------------------
export interface Table {
  id: number;
  number: string;
  capacity: number;
  status: string;
  [key: string]: any;
}

// ------------------------------
// 🔹 State Interface
// ------------------------------
export interface TablesState {
  allTables: Table[];
  tables: Table[];
  currentPage: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

// ------------------------------
// 🔹 Initial State
// ------------------------------
const initialState: TablesState = {
  allTables: [],
  tables: [],
  currentPage: parseInt(localStorage.getItem("currentPage") ?? "1", 10),
  limit: parseInt(localStorage.getItem("limit") ?? "10", 10),
  totalCount: 0,
  totalPages: 0,
  loading: false,
  error: null,
};

// ------------------------------
// 🔹 Reducer
// ------------------------------
const tablesReducer = (
  state: TablesState = initialState,
  action: { type: string; payload?: any }
): TablesState => {
  switch (action.type) {
    case fetchTables.pending.type:
      return { ...state, loading: true, error: null };

    case fetchTables.fulfilled.type: {
      const { results = [], totalCount = 0, totalPages = 0, currentPage = 1 } =
        action.payload || {};

      // Lưu currentPage vào localStorage
      localStorage.setItem("currentPage", String(currentPage));

      return {
        ...state,
        loading: false,
        allTables: results,
        tables: results.slice(0, state.limit),
        totalCount,
        totalPages,
        currentPage,
        error: null,
      };
    }

    case fetchTables.rejected.type:
      return {
        ...state,
        loading: false,
        error: action.payload || "Không thể tải danh sách bàn",
        tables: [],
      };

    default:
      return state;
  }
};

export default tablesReducer;
