import {
  FETCH_CATEGORY_BLOG_REQUEST,
  FETCH_CATEGORY_BLOG_SUCCESS,
  FETCH_CATEGORY_BLOG_FAILURE,
} from "../action/BlogDetailActions";

// Định nghĩa kiểu cho BlogDetailState
interface BlogDetailState {
  loading: boolean;
  blogDetail: any; // Nếu bạn có kiểu dữ liệu cụ thể cho blog, thay "any" bằng interface BlogType
  error: string | null;
}

// Kiểu cho action
interface BlogDetailAction {
  type: string;
  payload?: any;
}

const initialState: BlogDetailState = {
  loading: false,
  blogDetail: null,
  error: null,
};

const blogDetailReducer = (
  state: BlogDetailState = initialState,
  action: BlogDetailAction
): BlogDetailState => {
  switch (action.type) {
    case FETCH_CATEGORY_BLOG_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_CATEGORY_BLOG_SUCCESS:
      return {
        ...state,
        loading: false,
        blogDetail: action.payload,
      };
    case FETCH_CATEGORY_BLOG_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default blogDetailReducer;
