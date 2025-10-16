import {
  FETCH_ROLE_FAILURE,
  FETCH_ROLE_REQUEST,
  FETCH_ROLE_SUCCESS,
  SET_CURRENT_PAGE,
  SET_LIMIT,
} from "../Actions/RoleActions";

const initialState = {
  allRoles: [],
  role: [],
  currentPage: parseInt(localStorage.getItem("currentPage"), 10) || 1,
  limit: localStorage.getItem("limit") ? parseInt(localStorage.getItem("limit")) : 5,
  loading: false,
  error: "",
  totalCount: 0,
  totalPages: 0,
};

const roleReducer = (state = initialState, action) => {
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
      localStorage.setItem("currentPage", currentPage);

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
      localStorage.setItem("currentPage", action.payload);
      return {
        ...state,
        currentPage: action.payload,
        role: state.allRoles.slice(start, end),
      };
    }
    case SET_LIMIT: {
      const newLimit = action.payload;
      const totalPages = Math.ceil(state.allRoles.length / newLimit);
      const currentPage = Math.max(1, state.currentPage > totalPages ? totalPages : state.currentPage);
      const start = (currentPage - 1) * newLimit;
      const end = start + newLimit;

      localStorage.setItem("limit", newLimit);
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
