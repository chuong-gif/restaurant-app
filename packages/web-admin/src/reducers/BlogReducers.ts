import {
  FETCH_BLOG_FAILURE,
  FETCH_BLOG_REQUEST,
  FETCH_BLOG_SUCCESS,
  SET_CURRENT_PAGE,
  SET_LIMIT,
} from "../Actions/BlogActions";

const initialState = {
  allBlogs: [],
  blog: [],
  currentPage: parseInt(localStorage.getItem("currentPage"), 10) || 1,
  limit: localStorage.getItem("limit")
    ? parseInt(localStorage.getItem("limit"), 10)
    : 10,
  loading: false,
  error: "",
  totalCount: 0, // Tổng số blog
  totalPages: 0, // Tổng số trang
};

const blogReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BLOG_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case FETCH_BLOG_SUCCESS: {
      const { results, totalCount, totalPages, currentPage } = action.payload;

      // Lưu thông tin trang hiện tại vào localStorage
      localStorage.setItem("currentPage", currentPage);

      return {
        ...state,
        loading: false,
        allBlogs: results,
        totalCount,
        totalPages,
        currentPage,
        blog: results.slice(0, state.limit), // Chỉ lấy limit đầu tiên
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

      // Lưu trang hiện tại vào localStorage
      localStorage.setItem("currentPage", action.payload);

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

      // Lưu limit vào localStorage
      localStorage.setItem("limit", newLimit);

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
