import {
  FETCH_ROLE_FAILURE,
  FETCH_ROLE_REQUEST,
  FETCH_ROLE_SUCCESS,
  SET_CURRENT_PAGE,
  SET_LIMIT,
} from "../action/RoleActions";

// Kiểu cho action
interface RoleAction {
  type: string;
  payload?: any;
}

// Kiểu cho state
interface RoleState {
  allRoles: any[];
  role: any[];
  currentPage: number;
  limit: number;
  loading: boolean;
  error: string;
  totalCount: number;
  totalPages: number;
}

// Kiểm tra localStorage trả về null
const storedPage = localStorage.getItem("currentPage");
const storedLimit = localStorage.getItem("limit");

const initialState: RoleState = {
  allRoles: [],
  role: [],
  currentPage: storedPage !== null ? parseInt(storedPage, 10) : 1,
  limit: storedLimit !== null ? parseInt(storedLimit, 10) : 5,
  loading: false,
  error: "",
  totalCount: 0,
  totalPages: 0,
};

const roleReducer = (
  state: RoleState = initialState,
  action: RoleAction
): RoleState => {
  switch (action.type) {
    case FETCH_ROLE_REQUEST:
      return {
        ...state,
        loading: true,
        error: '',
      };
    case FETCH_ROLE_SUCCESS: {
      const {
        results = [],
        totalCount = 0,
        totalPages = 0,
        currentPage = 1,
      } = action.payload || {};
      const rolesArray = Array.isArray(results) ? results : [];
      localStorage.setItem("currentPage", currentPage.toString());

      return {
        ...state,
        loading: false,
        allRoles: rolesArray,
        totalCount,
        totalPages,
        currentPage,
        role: rolesArray.slice(0, state.limit),
      };
    }
    case FETCH_ROLE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SET_CURRENT_PAGE: {
      const start = (action.payload - 1) * state.limit;
      const end = start + state.limit;
      localStorage.setItem("currentPage", action.payload.toString());
      return {
        ...state,
        currentPage: action.payload,
        role: state.allRoles.slice(start, end),
      };
    }
    case SET_LIMIT: {
      const newLimit = action.payload;
      const totalPages = Math.ceil(state.allRoles.length / newLimit);
      const currentPage = Math.max(
        1,
        state.currentPage > totalPages ? totalPages : state.currentPage
      );
      const start = (currentPage - 1) * newLimit;
      const end = start + newLimit;

      localStorage.setItem("limit", newLimit.toString());
      return {
        ...state,
        limit: newLimit,
        currentPage,
        role: state.allRoles.slice(start, end),
      };
    }
    default:
      return state;
  }
};

export default roleReducer;
