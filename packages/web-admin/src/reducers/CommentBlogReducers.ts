import {
  FETCH_COMMENTBLOG_FAILURE,
  FETCH_COMMENTBLOG_REQUEST,
  FETCH_COMMENTBLOG_SUCCESS,
  SET_CURRENT_PAGE,
  SET_LIMIT,
} from '../action/CommentBlogActions';

// ---- Kiểu dữ liệu ----
interface CommentBlogState {
  currentPage: number;
  allCommentBlogs: any[];
  loading: boolean;
  commentBlog: any[];
  limit: number;
  error: string;
  totalCount: number;
  totalPages: number;
}

interface CommentBlogAction {
  type: string;
  payload?: any;
}

// ---- Hàm tiện ích lấy số an toàn từ localStorage ----
const getStoredNumber = (key: string, defaultValue: number): number => {
  const value = localStorage.getItem(key);
  return value ? parseInt(value, 10) : defaultValue;
};

// ---- State mặc định ----
const initialState: CommentBlogState = {
  currentPage: getStoredNumber("currentPage", 1),
  allCommentBlogs: [],
  loading: false,
  commentBlog: [],
  limit: getStoredNumber("limit", 10),
  error: '',
  totalCount: 0,
  totalPages: 0
};

// ---- Reducer ----
const commentBlogReducer = (
  state: CommentBlogState = initialState,
  action: CommentBlogAction
): CommentBlogState => {
  switch (action.type) {
    case FETCH_COMMENTBLOG_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_COMMENTBLOG_SUCCESS: {
      const { results, totalCount, totalPages, currentPage } = action.payload;
      const commentBlogs = Array.isArray(results) ? results : [];

      localStorage.setItem("currentPage", String(currentPage));

      return {
        ...state,
        loading: false,
        allCommentBlogs: commentBlogs,
        totalCount,
        totalPages,
        currentPage,
        commentBlog: commentBlogs.slice(0, state.limit),
      };
    }

    case FETCH_COMMENTBLOG_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case SET_CURRENT_PAGE: {
      const start = (action.payload - 1) * state.limit;
      const end = start + state.limit;

      localStorage.setItem("currentPage", String(action.payload));

      return {
        ...state,
        currentPage: action.payload,
        commentBlog: state.allCommentBlogs.slice(start, end),
      };
    }

    case SET_LIMIT: {
      const newLimit = action.payload;
      const totalPages = Math.ceil(state.allCommentBlogs.length / newLimit);
      const currentPage = state.currentPage > totalPages ? totalPages : state.currentPage;

      const start = (currentPage - 1) * newLimit;
      const end = start + newLimit;

      localStorage.setItem("limit", String(newLimit));

      return {
        ...state,
        limit: newLimit,
        currentPage,
        commentBlog: state.allCommentBlogs.slice(start, end),
      };
    }

    default:
      return state;
  }
};

export default commentBlogReducer;
