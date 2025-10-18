import {
  FETCH_CATEGORY_PRODUCT_NOPAGE_REQUEST,
  FETCH_CATEGORY_PRODUCT_NOPAGE_SUCCESS,
  FETCH_CATEGORY_PRODUCT_NOPAGE_FAILURE
} from '../action/CategoryProductNoPageActions';

const initialState = {
  loading: false,
  product_category: [],
  error: ''
};

const categoryProductNoPageReducer = (state = initialState, action) => {
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
