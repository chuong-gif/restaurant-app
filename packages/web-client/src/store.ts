import { combineReducers, applyMiddleware, createStore } from "redux";
import thunk, { type ThunkMiddleware } from "redux-thunk";
import blogReducer from "../src/reducers/BlogReducers"; // ✅ Dùng default import, không destructuring

// ------------------------------
// 🔹 Gộp các reducers
// ------------------------------
const rootReducer = combineReducers({
  blog: blogReducer,
  // thêm các reducer khác tại đây
});

// ------------------------------
// 🔹 Khởi tạo store
// ------------------------------
export const store = createStore(
  rootReducer,
  applyMiddleware(thunk as unknown as ThunkMiddleware)
);

// ------------------------------
// 🔹 Kiểu RootState để dùng trong useSelector
// ------------------------------
export type RootState = ReturnType<typeof rootReducer>;
