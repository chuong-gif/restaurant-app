import {
  FETCH_CONTACT_FAILURE,
  FETCH_CONTACT_REQUEST,
  FETCH_CONTACT_SUCCESS,
} from "../Actions/ContactActions";

// Kiểu dữ liệu cho một contact (tùy chỉnh lại theo API thực tế)
interface Contact {
  id: number;
  name: string;
  email?: string;
  message?: string;
  createdAt?: string;
  [key: string]: any;
}

// Kiểu state
interface ContactState {
  loading: boolean;
  contact: Contact[];
  error: string;
}

// Kiểu action
interface ContactAction {
  type: string;
  payload?: any;
}

const initialState: ContactState = {
  loading: false,
  contact: [],
  error: "",
};

const contactReducer = (
  state: ContactState = initialState,
  action: ContactAction
): ContactState => {
  switch (action.type) {
    case FETCH_CONTACT_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case FETCH_CONTACT_SUCCESS:
      return {
        loading: false,
        contact: Array.isArray(action.payload) ? action.payload : [],
        error: "",
      };

    case FETCH_CONTACT_FAILURE:
      return {
        loading: false,
        contact: [],
        error: action.payload,
      };

    default:
      return state;
  }
};

export default contactReducer;
