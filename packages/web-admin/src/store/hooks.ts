// Import các giá trị (hàm)
import { useDispatch, useSelector } from "react-redux";
// Import các kiểu dữ liệu (type)
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./index";

// Custom hooks giúp dùng Redux với TypeScript gọn hơn
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
