import {
  FETCH_AUTH_FAILURE,
  FETCH_AUTH_REQUEST,
  FETCH_AUTH_SUCCESS,
  SHOW_SUCCESS_ALERT,
  SHOW_ERROR_ALERT,
  CHECK_AUTH_STATUS,
} from "../Actions/AuthActions";

// Định nghĩa kiểu cho state
interface AuthState {
  successAlert: string | null;
  errorAlert: string | null;
  loading: boolean;
  auth: any; // Có thể thay `any` bằng kiểu cụ thể nếu bạn biết cấu trúc của user (VD: UserType)
  error: string;
  isAuthenticated: boolean;
}

// Kiểu cho action
interface AuthAction {
  type: string;
  payload?: any;
}

const initialState: AuthState = {
  successAlert: null,
  errorAlert: null,
  loading: false,
  auth: null,
  error: "",
  isAuthenticated: false, // Thêm trạng thái này
};

const authReducer = (
  state: AuthState = initialState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case FETCH_AUTH_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        auth: Array.isArray(action.payload) ? action.payload : [],
        error: "",
        isAuthenticated: true, // Đăng nhập thành công
      };
    case FETCH_AUTH_FAILURE:
      return {
        ...state,
        loading: false,
        auth: null,
        error: action.payload,
        isAuthenticated: false, // Đăng nhập thất bại
      };
    case SHOW_SUCCESS_ALERT:
      return {
        ...state,
        successAlert: action.payload,
      };
    case SHOW_ERROR_ALERT:
      return {
        ...state,
        errorAlert: action.payload,
      };
    case CHECK_AUTH_STATUS:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        auth: action.payload.user,
        loading: false,
      };
    default:
      return state;
  }
};

export default authReducer;
