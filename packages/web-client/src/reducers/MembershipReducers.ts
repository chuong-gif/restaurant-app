import {
  FETCH_MEMBERSHIP_FAILURE,
  FETCH_MEMBERSHIP_REQUEST,
  FETCH_MEMBERSHIP_SUCCESS,
} from "../Actions/MembershipActions";

// ------------------------------
// 🔹 Interfaces
// ------------------------------
export interface Membership {
  id?: number;
  name?: string;
  level?: string;
  points?: number;
  discount?: number;
  [key: string]: any;
}

export interface MembershipState {
  loading: boolean;
  membership: Membership[];
  error: string;
}

export interface MembershipAction {
  type: string;
  payload?: any;
}

// ------------------------------
// 🔹 Initial State
// ------------------------------
const initialState: MembershipState = {
  loading: false,
  membership: [],
  error: "",
};

// ------------------------------
// 🔹 Reducer
// ------------------------------
const MembershipReducer = (
  state = initialState,
  action: MembershipAction
): MembershipState => {
  switch (action.type) {
    case FETCH_MEMBERSHIP_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case FETCH_MEMBERSHIP_SUCCESS:
      return {
        loading: false,
        membership: action.payload,
        error: "",
      };
    case FETCH_MEMBERSHIP_FAILURE:
      return {
        loading: false,
        membership: [],
        error: action.payload,
      };
    default:
      return state;
  }
};

export default MembershipReducer;
