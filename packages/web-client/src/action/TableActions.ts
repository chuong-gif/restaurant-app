import axios from "axios";
import { API_ENDPOINT, API_DATA } from "../Config/Client/APIs";

// Action Types
export const FETCH_TABLE_REQUEST = 'FETCH_TABLE_REQUEST';
export const FETCH_TABLE_SUCCESS = 'FETCH_TABLE_SUCCESS';
export const FETCH_TABLE_FAILURE = 'FETCH_TABLE_FAILURE';

// Action Creators
export const fetchTableRequest = () => ({
    type: FETCH_TABLE_REQUEST
});

export const fetchTableSuccess = table => ({
    type: FETCH_TABLE_SUCCESS,
    payload: table
});

export const fetchTableFailure = error => ({
    type: FETCH_TABLE_FAILURE,
    payload: error
});

// Thunk to fetch tables
export const fetchTable = () => {
    return async (dispatch) => {
        dispatch(fetchTableRequest());
        try {
            const response = await axios.get(`${API_ENDPOINT}${API_DATA.table}`);
            const tables = response.data.results;
            dispatch(fetchTableSuccess(tables));
            return tables; // Trả về dữ liệu để component có thể sử dụng
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Lỗi khi lấy dữ liệu bàn";
            dispatch(fetchTableFailure(errorMsg));
            throw new Error(errorMsg); // Ném lỗi để component có thể bắt
        }
    };
};
