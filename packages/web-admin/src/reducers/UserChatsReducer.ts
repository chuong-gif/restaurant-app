// ------------------------------
// 🔹 State Interface
// ------------------------------
export interface UserChatsState {
  chats: any[]; // Có thể thay any bằng interface Chat nếu bạn đã định nghĩa
  loading: boolean;
  error: string | null;
}

// ------------------------------
// 🔹 Initial State
// ------------------------------
const initialState: UserChatsState = {
  chats: [],
  loading: false,
  error: null,
};

// ------------------------------
// 🔹 Reducer
// ------------------------------
interface Action {
  type: string;
  payload?: any;
}

const userChatsReducer = (
  state: UserChatsState = initialState,
  action: Action
): UserChatsState => {
  switch (action.type) {
    case "FETCH_CHATS_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_CHATS_SUCCESS":
      return { ...state, loading: false, chats: action.payload };
    case "FETCH_CHATS_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default userChatsReducer;
