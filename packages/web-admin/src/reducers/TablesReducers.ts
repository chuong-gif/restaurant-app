import {
  FETCH_TABLE_REQUEST,
  FETCH_TABLE_SUCCESS,
  FETCH_TABLE_FAILURE,
  SET_CURRENT_PAGE,
  SET_LIMIT,
} from "../Actions/TablesActions";

const initialState = {
  allTables: [], // Tất cả dữ liệu bảng
  tables: [], // Dữ liệu bảng cho trang hiện tại
  currentPage: parseInt(localStorage.getItem("currentPage"), 10) || 1,
  limit: localStorage.getItem("limit")
    ? parseInt(localStorage.getItem("limit"))
    : 10,
  loading: false,
  error: "",
  totalCount: 0,
  totalPages: 0,
};

const tablesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TABLE_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case FETCH_TABLE_SUCCESS: {
      const { results = [], totalCount = 0, totalPages = 0, currentPage = 1 } = action.payload;
      localStorage.setItem("currentPage", currentPage);
      return {
        ...state,
        loading: false,
        allTables: results,
        totalCount,
        totalPages,
        currentPage,
        tables: results.slice(0, state.limit),
      };
    }
    case FETCH_TABLE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        tables: [],
      };
    case SET_CURRENT_PAGE: {
      const start = (action.payload - 1) * state.limit;
      const end = start + state.limit;
      localStorage.setItem("currentPage", action.payload);
      return {
        ...state,
        currentPage: action.payload,
        tables: state.allTables.slice(start, end),
      };
    }
    case SET_LIMIT: {
      const newLimit = action.payload;
      const totalPages = Math.ceil(state.allTables.length / newLimit);
      const currentPage = state.currentPage > totalPages ? totalPages : state.currentPage;
      const start = (currentPage - 1) * newLimit;
      const end = start + newLimit;
      localStorage.setItem("limit", newLimit);
      return {
        ...state,
        limit: newLimit,
        currentPage,
        tables: state.allTables.slice(start, end),
      };
    }
    default:
      return state;
  }
};

export default tablesReducer;
