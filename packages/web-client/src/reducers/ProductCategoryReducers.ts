import {
  FETCH_PRODUCT_CATEGORY_REQUEST,
  FETCH_PRODUCT_CATEGORY_SUCCESS,
  FETCH_PRODUCT_CATEGORY_FAILURE,
} from "../Actions/ProductCategoryActions";

// ------------------------------
// 🔹 Interfaces
// ------------------------------
export interface ProductCategory {
  id?: number;
  name?: string;
  description?: string;
  [key: string]: any;
}

export interface ProductCategoryState {
  loading: boolean;
  product_category: ProductCategory[];
  error: string;
}

export interface ProductCategoryAction {
  type: string;
  payload?: any;
}

// ------------------------------
// 🔹 Initial State
// ------------------------------
const initialState: ProductCategoryState = {
  loading: false,
  product_category: [],
  error: "",
};

// ------------------------------
// 🔹 Reducer
// ------------------------------
const productCategoryReducer = (
  state = initialState,
  action: ProductCategoryAction
): ProductCategoryState => {
  switch (action.type) {
    case FETCH_PRODUCT_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case FETCH_PRODUCT_CATEGORY_SUCCESS:
      return {
        loading: false,
        product_category: Array.isArray(action.payload)
          ? action.payload
          : [],
        error: "",
      };

    case FETCH_PRODUCT_CATEGORY_FAILURE:
      return {
        loading: false,
        product_category: [],
        error: action.payload,
      };

    default:
      return state;
  }
};

export default productCategoryReducer;
