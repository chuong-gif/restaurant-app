import axios, { type AxiosResponse } from "axios";
import { API_ENDPOINT, API_DATA } from "../configs/APIs";
import type { Dispatch } from "redux";

// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_TABLE_REQUEST = "FETCH_TABLE_REQUEST";
export const FETCH_TABLE_SUCCESS = "FETCH_TABLE_SUCCESS";
export const FETCH_TABLE_FAILURE = "FETCH_TABLE_FAILURE";

// ------------------------------
// 🔹 Kiểu dữ liệu
// ------------------------------
export interface Table {
    id: string;
    name: string;
    status?: string;
    [key: string]: any;
}

export interface FetchTableRequestAction {
    type: typeof FETCH_TABLE_REQUEST;
}

export interface FetchTableSuccessAction {
    type: typeof FETCH_TABLE_SUCCESS;
    payload: Table[];
}

export interface FetchTableFailureAction {
    type: typeof FETCH_TABLE_FAILURE;
    payload: string;
}

export type TableActionTypes =
    | FetchTableRequestAction
    | FetchTableSuccessAction
    | FetchTableFailureAction;

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchTableRequest = (): FetchTableRequestAction => ({
    type: FETCH_TABLE_REQUEST,
});

export const fetchTableSuccess = (table: Table[]): FetchTableSuccessAction => ({
    type: FETCH_TABLE_SUCCESS,
    payload: table,
});

export const fetchTableFailure = (error: string): FetchTableFailureAction => ({
    type: FETCH_TABLE_FAILURE,
    payload: error,
});

// ------------------------------
// 🔹 Thunk: Lấy danh sách bàn
// ------------------------------
export const fetchTable = () => {
    return async (dispatch: Dispatch<TableActionTypes>): Promise<Table[]> => {
        dispatch(fetchTableRequest());
        try {
            const response: AxiosResponse<{ results: Table[] }> = await axios.get(
                `${API_ENDPOINT}${API_DATA.table}`
            );

            const tables = response.data.results;
            dispatch(fetchTableSuccess(tables));
            return tables;
        } catch (error: unknown) {
            let errorMsg = "Lỗi khi lấy dữ liệu bàn";

            if (axios.isAxiosError(error)) {
                errorMsg =
                    error.response?.data?.message ||
                    error.message ||
                    errorMsg;
            }

            dispatch(fetchTableFailure(errorMsg));
            throw new Error(errorMsg);
        }
    };
};
