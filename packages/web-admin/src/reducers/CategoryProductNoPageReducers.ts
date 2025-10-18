import {
  FETCH_CATEGORY_PRODUCT_NOPAGE_REQUEST,
  FETCH_CATEGORY_PRODUCT_NOPAGE_SUCCESS,
  FETCH_CATEGORY_PRODUCT_NOPAGE_FAILURE
} from '../action/CategoryProductNoPageActions';

// Định nghĩa kiểu cho state
interface CategoryProductNoPageState {
  loading: boolean;
  product_category: any[];
  error: string;
}

// Định nghĩa kiểu cho action
interface CategoryProductNoPageAction {
  type: string;
  payload?: any;
}

// State mặc định
const initialState: CategoryProductNoPageState = {
  loading: false,
  product_category: [],
  error: ''
};

// Reducer
const categoryProductNoPageReducer = (
  state: CategoryProductNoPageState = initialState,
  action: CategoryProductNoPageAction
): CategoryProductNoPageState => {
  switch (action.type) {
    case FETCH_CATEGORY_PRODUCT_NOPAGE_REQUEST:
      return {
        ...state,
        loading: true,
        error: ''
      };

    case FETCH_CATEGORY_PRODUCT_NOPAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        product_category: Array.isArray(action.payload) ? action.payload : [],
        error: ''
      };

    case FETCH_CATEGORY_PRODUCT_NOPAGE_FAILURE:
      return {
        ...state,
        loading: false,
        product_category: [],
        error: action.payload
      };

    default:
      return state;
  }
};

export default categoryProductNoPageReducer;
