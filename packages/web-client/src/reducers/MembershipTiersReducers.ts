import {
  FETCH_MEMBERSHIP_TIERS_FAILURE,
  FETCH_MEMBERSHIP_TIERS_REQUEST,
  FETCH_MEMBERSHIP_TIERS_SUCCESS,
} from "../Actions/MembershipTiersActions";

// ------------------------------
// 🔹 Interfaces
// ------------------------------
export interface MembershipTier {
  id?: number;
  name?: string;
  minPoints?: number;
  discountRate?: number;
  description?: string;
  [key: string]: any;
}

export interface MembershipTiersState {
  loading: boolean;
  membership_tiers: MembershipTier[];
  error: string;
}

export interface MembershipTiersAction {
  type: string;
  payload?: any;
}

// ------------------------------
// 🔹 Initial State
// ------------------------------
const initialState: MembershipTiersState = {
  loading: false,
  membership_tiers: [],
  error: "",
};

// ------------------------------
// 🔹 Reducer
// ------------------------------
const MembershipTiersReducer = (
  state = initialState,
  action: MembershipTiersAction
): MembershipTiersState => {
  switch (action.type) {
    case FETCH_MEMBERSHIP_TIERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case FETCH_MEMBERSHIP_TIERS_SUCCESS:
      return {
        loading: false,
        membership_tiers: action.payload,
        error: "",
      };

    case FETCH_MEMBERSHIP_TIERS_FAILURE:
      return {
        loading: false,
        membership_tiers: [],
        error: action.payload,
      };

    default:
      return state;
  }
};

export default MembershipTiersReducer;
