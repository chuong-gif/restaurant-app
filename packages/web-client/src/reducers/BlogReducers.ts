import {
  FETCH_BLOG_FAILURE,
  FETCH_BLOG_REQUEST,
  FETCH_BLOG_SUCCESS,
  SET_CURRENT_PAGE,
} from "../Actions/BlogActions";

// Định nghĩa kiểu dữ liệu cho Blog (tùy theo cấu trúc thực tế)
interface Blog {
  id: number;
  title: string;
  content: string;
  [key: string]: any; // mở rộng linh hoạt
}

// Kiểu state cho reducer
interface BlogState {
  currentPage: number;
  pageSize: number;
  allBlog: Blog[];
  loading: boolean;
  blogs: Blog[];
  error: string;
  totalCount: number;
  totalPages: number;
}

// Kiểu action
interface BlogAction {
  type: string;
  payload?: any;
}

const initialState: BlogState = {
  currentPage: 1,
  pageSize: 20,
  allBlog: [],
  loading: false,
  blogs: [],
  error: "",
  totalCount: 0,
  totalPages: 0,
};

const blogReducer = (
  state: BlogState = initialState,
  action: BlogAction
): BlogState => {
  switch (action.type) {
    case FETCH_BLOG_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_BLOG_SUCCESS:
      return {
        ...state,
        loading: false,
        allBlog: action.payload.results,
        totalCount: action.payload.totalCount,
        totalPages: action.payload.totalPages,
        currentPage: action.payload.currentPage,
        blogs: action.payload.results
          ? action.payload.results.slice(0, state.pageSize)
          : [],
      };

    case FETCH_BLOG_FAILURE:
      return {
        ...state,
        loading: false,
        blogs: [],
        error: action.payload,
      };

    case SET_CURRENT_PAGE:
      const start = (action.payload - 1) * state.pageSize;
      const end = start + state.pageSize;
      return {
        ...state,
        currentPage: action.payload,
        blogs: state.allBlog.slice(start, end),
      };

    default:
      return state;
  }
};

export default blogReducer;
