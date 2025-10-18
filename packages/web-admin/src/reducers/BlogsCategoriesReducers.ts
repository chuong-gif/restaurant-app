import {
  FETCH_BLOG_FAILURE,
  FETCH_BLOG_REQUEST,
  FETCH_BLOG_SUCCESS,
  SET_CURRENT_PAGE,
  SET_LIMIT,
} from "../action/BlogActions";

// ---- Kiểu dữ liệu ----
interface BlogState {
  allBlogs: any[];
  blog: any[];
  currentPage: number;
  limit: number;
  loading: boolean;
  error: string;
  totalCount: number;
  totalPages: number;
}

interface BlogAction {
  type: string;
  payload?: any;
}

// ---- Lấy dữ liệu từ localStorage một cách an toàn ----
const getStoredNumber = (key: string, defaultValue: number): number => {
  const value = localStorage.getItem(key);
  return value ? parseInt(value, 10) : defaultValue;
};

// ---- State mặc định ----
const initialState: BlogState = {
  allBlogs: [],
  blog: [],
  currentPage: getStoredNumber("currentPage", 1),
  limit: getStoredNumber("limit", 10),
  loading: false,
  error: "",
  totalCount: 0,
  totalPages: 0,
};

// ---- Reducer ----
const blogReducer = (
  state: BlogState = initialState,
  action: BlogAction
): BlogState => {
  switch (action.type) {
    case FETCH_BLOG_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case FETCH_BLOG_SUCCESS: {
      const { results, totalCount, totalPages, currentPage } = action.payload;

      // Lưu thông tin trang hiện tại
      localStorage.setItem("currentPage", String(currentPage));

      return {
        ...state,
        loading: false,
        allBlogs: results,
        totalCount,
        totalPages,
        currentPage,
        blog: results.slice(0, state.limit), // lấy số lượng theo limit
      };
    }

    case FETCH_BLOG_FAILURE:
      return {
        ...state,
        loading: false,
        blog: [],
        allBlogs: [],
        error: action.payload,
      };

    case SET_CURRENT_PAGE: {
      const start = (action.payload - 1) * state.limit;
      const end = start + state.limit;

      localStorage.setItem("currentPage", String(action.payload));

      return {
        ...state,
        currentPage: action.payload,
        blog: state.allBlogs.slice(start, end),
      };
    }

    case SET_LIMIT: {
      const newLimit = action.payload;
      const totalPages = Math.ceil(state.allBlogs.length / newLimit);
      const currentPage =
        state.currentPage > totalPages ? totalPages : state.currentPage;

      const start = (currentPage - 1) * newLimit;
      const end = start + newLimit;

      localStorage.setItem("limit", String(newLimit));

      return {
        ...state,
        limit: newLimit,
        currentPage,
        blog: state.allBlogs.slice(start, end),
      };
    }

    default:
      return state;
  }
};

export default blogReducer;
