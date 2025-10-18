import { fetchUsers, type User } from "../action/UsersAction";

// ------------------------------
// 🔹 State Interface
// ------------------------------
export interface UserState {
  allUsers: User[];
  user: User[];
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
const initialState: UserState = {
  allUsers: [],
  user: [],
  currentPage: parseInt(localStorage.getItem("currentPage") ?? "1", 10),
  limit: parseInt(localStorage.getItem("limit") ?? "10", 10),
  totalCount: 0,
  totalPages: 0,
  loading: false,
  error: null,
};

// ------------------------------
// 🔹 Action type
// ------------------------------
interface Action {
  type: string;
  payload?: any;
}

// ------------------------------
// 🔹 Reducer
// ------------------------------
const userReducer = (state: UserState = initialState, action: Action): UserState => {
  switch (action.type) {
    case fetchUsers.pending.type:
      return { ...state, loading: true, error: null };

    case fetchUsers.fulfilled.type: {
      const { results = [], totalCount = 0, totalPages = 0, currentPage = 1 } =
        action.payload || {};

      localStorage.setItem("currentPage", String(currentPage));

      return {
        ...state,
        loading: false,
        allUsers: Array.isArray(results) ? results : [],
        user: Array.isArray(results) ? results.slice(0, state.limit) : [],
        totalCount,
        totalPages,
        currentPage,
        error: null,
      };
    }

    case fetchUsers.rejected.type:
      return {
        ...state,
        loading: false,
        error: action.payload || "Failed to fetch users",
        user: [],
      };

    default:
      return state;
  }
};

export default userReducer;
