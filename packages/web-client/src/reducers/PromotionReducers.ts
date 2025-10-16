import {
  FETCH_PROMOTION_FAILURE,
  FETCH_PROMOTION_REQUEST,
  FETCH_PROMOTION_SUCCESS,
} from "../Actions/PromotionActions";

// ------------------------------
// 🔹 Interfaces
// ------------------------------
export interface Promotion {
  id?: number;
  title?: string;
  discount?: number;
  startDate?: string;
  endDate?: string;
  [key: string]: any;
}

export interface PromotionState {
  loading: boolean;
  promotion: Promotion[];
  error: string;
}

export interface PromotionAction {
  type: string;
  payload?: any;
}

// ------------------------------
// 🔹 Initial State
// ------------------------------
const initialState: PromotionState = {
  loading: false,
  promotion: [],
  error: "",
};

// ------------------------------
// 🔹 Reducer
// ------------------------------
const promotionReducer = (
  state = initialState,
  action: PromotionAction
): PromotionState => {
  switch (action.type) {
    case FETCH_PROMOTION_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case FETCH_PROMOTION_SUCCESS:
      return {
        loading: false,
        promotion: Array.isArray(action.payload) ? action.payload : [],
        error: "",
      };

    case FETCH_PROMOTION_FAILURE:
      return {
        loading: false,
        promotion: [],
        error: action.payload,
      };

    default:
      return state;
  }
};

export default promotionReducer;
