import {
  FETCH_CATEGORY_BLOG_REQUEST,
  FETCH_CATEGORY_BLOG_SUCCESS,
  FETCH_CATEGORY_BLOG_FAILURE,
  SET_CURRENT_PAGE,
  SET_LIMIT
} from '../Actions/BlogsCategoriesActions';

const initialState = {
  allCategories: [],       // Tất cả danh mục
  categories: [],          // Danh mục hiển thị trang hiện tại
  currentPage: parseInt(localStorage.getItem('currentPage'), 10) || 1,
  limit: localStorage.getItem('limit') ? parseInt(localStorage.getItem('limit'), 10) : 5,
  loading: false,
  error: '',
  totalCount: 0,
  totalPages: 0
};

const blogsCategoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CATEGORY_BLOG_REQUEST:
      return {
        ...state,
        loading: true,
        error: ''
      };

    case FETCH_CATEGORY_BLOG_SUCCESS: {
      const { results, totalCount, totalPages, currentPage } = action.payload;

      // Lưu currentPage vào localStorage
      localStorage.setItem('currentPage', currentPage);

      return {
        ...state,
        loading: false,
        allCategories: results,
        totalCount,
        totalPages,
        currentPage,
        categories: results.slice(0, state.limit) // Trang đầu tiên
      };
    }

    case FETCH_CATEGORY_BLOG_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        categories: []
      };

    case SET_CURRENT_PAGE: {
      const start = (action.payload - 1) * state.limit;
      const end = start + state.limit;

      // Lưu currentPage vào localStorage
      localStorage.setItem('currentPage', action.payload);

      return {
        ...state,
        currentPage: action.payload,
        categories: state.allCategories.slice(start, end)
      };
    }

    case SET_LIMIT: {
      const newLimit = action.payload;
      const totalPages = Math.ceil(state.allCategories.length / newLimit);
      const currentPage = state.currentPage > totalPages ? totalPages : state.currentPage;

      const start = (currentPage - 1) * newLimit;
      const end = start + newLimit;

      // Lưu limit vào localStorage
      localStorage.setItem('limit', newLimit);

      return {
        ...state,
        limit: newLimit,
        currentPage,
        categories: state.allCategories.slice(start, end)
      };
    }

    default:
      return state;
  }
};

export default blogsCategoriesReducer;
