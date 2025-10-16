import {
  FETCH_PRODUCT_FAILURE,
  FETCH_PRODUCT_REQUEST,
  FETCH_PRODUCT_SUCCESS,
} from "../Actions/ProductActions";

// ------------------------------
// 🔹 Interfaces
// ------------------------------
export interface Product {
  id?: number;
  name?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  [key: string]: any;
}

export interface ProductState {
  loading: boolean;
  product: Product[];
  error: string;
}

export interface ProductAction {
  type: string;
  payload?: any;
}

// ------------------------------
// 🔹 Initial State
// ------------------------------
const initialState: ProductState = {
  loading: false,
  product: [],
  error: "",
};

// ------------------------------
// 🔹 Reducer
// ------------------------------
const productReducer = (
  state = initialState,
  action: ProductAction
): ProductState => {
  switch (action.type) {
    case FETCH_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case FETCH_PRODUCT_SUCCESS:
      return {
        loading: false,
        product: Array.isArray(action.payload) ? action.payload : [],
        error: "",
      };

    case FETCH_PRODUCT_FAILURE:
      return {
        loading: false,
        product: [],
        error: action.payload,
      };

    default:
      return state;
  }
};

export default productReducer;
