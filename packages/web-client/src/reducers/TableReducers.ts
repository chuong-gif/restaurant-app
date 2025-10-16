import {
  FETCH_TABLE_REQUEST,
  FETCH_TABLE_SUCCESS,
  FETCH_TABLE_FAILURE,
} from "../Actions/TableActions";

// ------------------------------
// 🔹 Interfaces
// ------------------------------
export interface Table {
  id?: number;
  name?: string;
  capacity?: number;
  location?: string;
  status?: string;
  [key: string]: any; // Cho phép thêm các thuộc tính linh hoạt khác
}

export interface TableState {
  loading: boolean;
  table: Table[];
  error: string;
}

export interface TableAction {
  type: string;
  payload?: any;
}

// ------------------------------
// 🔹 Initial State
// ------------------------------
const initialState: TableState = {
  loading: false,
  table: [],
  error: "",
};

// ------------------------------
// 🔹 Reducer
// ------------------------------
const tableReducer = (
  state = initialState,
  action: TableAction
): TableState => {
  switch (action.type) {
    case FETCH_TABLE_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case FETCH_TABLE_SUCCESS:
      return {
        loading: false,
        table: Array.isArray(action.payload) ? action.payload : [],
        error: "",
      };

    case FETCH_TABLE_FAILURE:
      return {
        loading: false,
        table: [],
        error: action.payload,
      };

    default:
      return state;
  }
};

export default tableReducer;
