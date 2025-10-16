import {
  FETCH_PRODUCT_DETAIL_FAILURE,
  FETCH_PRODUCT_DETAIL_REQUEST,
  FETCH_PRODUCT_DETAIL_SUCCESS,
} from "../Actions/ProductDetailActions";

// ------------------------------
// 🔹 Interfaces
// ------------------------------
export interface ProductDetail {
  id?: number;
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  [key: string]: any;
}

export interface ProductDetailState {
  loading: boolean;
  productDetail: ProductDetail | null;
  error: string;
}

export interface ProductDetailAction {
  type: string;
  payload?: any;
}

// ------------------------------
// 🔹 Initial State
// ------------------------------
const initialState: ProductDetailState = {
  loading: false,
  productDetail: null,
  error: "",
};

// ------------------------------
// 🔹 Reducer
// ------------------------------
const productDetailReducer = (
  state = initialState,
  action: ProductDetailAction
): ProductDetailState => {
  switch (action.type) {
    case FETCH_PRODUCT_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case FETCH_PRODUCT_DETAIL_SUCCESS:
      return {
        loading: false,
        productDetail: action.payload,
        error: "",
      };

    case FETCH_PRODUCT_DETAIL_FAILURE:
      return {
        loading: false,
        productDetail: null,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default productDetailReducer;
