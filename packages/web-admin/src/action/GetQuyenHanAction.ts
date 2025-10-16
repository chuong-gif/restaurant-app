import axios from "axios";
import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { API_ENDPOINT } from "../Config/APIs";

// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_QUYEN_HAN_REQUEST = 'FETCH_QUYEN_HAN_REQUEST';
export const FETCH_QUYEN_HAN_SUCCESS = 'FETCH_QUYEN_HAN_SUCCESS';
export const FETCH_QUYEN_HAN_FAILURE = 'FETCH_QUYEN_HAN_FAILURE';

// ------------------------------
// 🔹 Interfaces
// ------------------------------
export interface QuyenHan {
    id: number;
    name: string;
    permissions: string[];
    [key: string]: any;
}

interface FetchQuyenHanRequestAction {
    type: typeof FETCH_QUYEN_HAN_REQUEST;
}

interface FetchQuyenHanSuccessAction {
    type: typeof FETCH_QUYEN_HAN_SUCCESS;
    payload: QuyenHan[];
}

interface FetchQuyenHanFailureAction {
    type: typeof FETCH_QUYEN_HAN_FAILURE;
    payload: string;
}

export type QuyenHanActions =
    | FetchQuyenHanRequestAction
    | FetchQuyenHanSuccessAction
    | FetchQuyenHanFailureAction;

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchQuyenHanRequest = (): FetchQuyenHanRequestAction => ({
    type: FETCH_QUYEN_HAN_REQUEST
});

export const fetchQuyenHanSuccess = (auth: QuyenHan[]): FetchQuyenHanSuccessAction => ({
    type: FETCH_QUYEN_HAN_SUCCESS,
    payload: auth
});

export const fetchQuyenHanFailure = (error: string): FetchQuyenHanFailureAction => ({
    type: FETCH_QUYEN_HAN_FAILURE,
    payload: error
});

// ------------------------------
// 🔹 Thunk Action
// ------------------------------
export const getPermissions = (
    id: number
): ThunkAction<Promise<void>, {}, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(fetchQuyenHanRequest());
        try {
            const response = await axios.post(`${API_ENDPOINT}/auth_admin/role_permissions`, { id });
            if (response.status === 200) {
                const data: QuyenHan[] = response.data;
                dispatch(fetchQuyenHanSuccess(data));
            } else {
                dispatch(fetchQuyenHanFailure('Unexpected response status: ' + response.status));
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch permissions';
            dispatch(fetchQuyenHanFailure(errorMsg));
        }
    };
};
