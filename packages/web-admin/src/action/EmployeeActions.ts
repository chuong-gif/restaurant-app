import type { ThunkAction } from "redux-thunk";
import type { AnyAction } from "redux";
import { API_ENDPOINT } from "../configs/client/APIs";
import AdminConfig from "../configs/client/index";
import http from "../Utils/Http";
import { fetchRole } from "./RoleActions";

// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_EMPLOYEE_REQUEST = 'FETCH_EMPLOYEE_REQUEST';
export const FETCH_EMPLOYEE_SUCCESS = 'FETCH_EMPLOYEE_SUCCESS';
export const FETCH_EMPLOYEE_FAILURE = 'FETCH_EMPLOYEE_FAILURE';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';

// ------------------------------
// 🔹 Interfaces
// ------------------------------
export interface Employee {
    id: number;
    fullname: string;
    email: string;
    role?: string;
    phone?: string;
    [key: string]: any;
}

export interface EmployeeState {
    allEmployee: Employee[];
    employee: Employee[];
    currentPage: number;
    pageSize: number;
    loading: boolean;
    error: string;
    totalCount: number;
    totalPages: number;
}

interface FetchEmployeeRequestAction {
    type: typeof FETCH_EMPLOYEE_REQUEST;
}

interface FetchEmployeeSuccessAction {
    type: typeof FETCH_EMPLOYEE_SUCCESS;
    payload: {
        results: Employee[];
        totalCount: number;
        totalPages: number;
        currentPage: number;
    };
}

interface FetchEmployeeFailureAction {
    type: typeof FETCH_EMPLOYEE_FAILURE;
    payload: string;
}

interface SetCurrentPageAction {
    type: typeof SET_CURRENT_PAGE;
    payload: number;
}

export type EmployeeActions =
    | FetchEmployeeRequestAction
    | FetchEmployeeSuccessAction
    | FetchEmployeeFailureAction
    | SetCurrentPageAction;

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchEmployeeRequest = (): FetchEmployeeRequestAction => ({
    type: FETCH_EMPLOYEE_REQUEST
});

export const fetchEmployeeSuccess = (
    results: Employee[],
    totalCount: number,
    totalPages: number,
    currentPage: number
): FetchEmployeeSuccessAction => ({
    type: FETCH_EMPLOYEE_SUCCESS,
    payload: { results, totalCount, totalPages, currentPage }
});

export const fetchEmployeeFailure = (error: string): FetchEmployeeFailureAction => ({
    type: FETCH_EMPLOYEE_FAILURE,
    payload: error
});

export const setCurrentPage = (page: number): SetCurrentPageAction => ({
    type: SET_CURRENT_PAGE,
    payload: page
});

// ------------------------------
// 🔹 Thunk Actions
// ------------------------------
export const fetchEmployees = (
    fullname = '',
    page = 1,
    pageSize = 10
): ThunkAction<void, EmployeeState, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(fetchEmployeeRequest());

        const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.employee}`);
        if (fullname) url.searchParams.append('search', fullname);
        url.searchParams.append('page', page.toString());
        url.searchParams.append('pageSize', pageSize.toString());

        try {
            const response = await http.get(url.toString());
            const { results, totalCount, totalPages, currentPage } = response.data;
            dispatch(fetchEmployeeSuccess(results, totalCount, totalPages, currentPage));
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to fetch employees";
            dispatch(fetchEmployeeFailure(errorMsg));
        }
    };
};

export const addEmployee = (
    employee: Partial<Employee>
): ThunkAction<void, EmployeeState, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(fetchEmployeeRequest());
        try {
            await http.post(`${API_ENDPOINT}/${AdminConfig.routes.employee}`, employee);
            dispatch(fetchEmployees());
            dispatch(fetchRole());
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to add employee";
            dispatch(fetchEmployeeFailure(errorMsg));
        }
    };
};

export const updateEmployee = (
    id: number,
    data: Partial<Employee>
): ThunkAction<void, EmployeeState, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(fetchEmployeeRequest());
        try {
            await http.patch(`${API_ENDPOINT}/${AdminConfig.routes.employee}/${id}`, data);
            dispatch(fetchEmployees());
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to update employee";
            dispatch(fetchEmployeeFailure(errorMsg));
        }
    };
};

export const deleteEmployee = (
    id: number
): ThunkAction<void, EmployeeState, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(fetchEmployeeRequest());
        try {
            await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.employee}/${id}`);
            dispatch(fetchEmployees());
        } catch (error: any) {
            const errorMsg = error.message || "Failed to delete employee";
            dispatch(fetchEmployeeFailure(errorMsg));
        }
    };
};

// ------------------------------
// 🔹 Utility function
// ------------------------------
export const checkEmailExists = async (email: string): Promise<Employee | null> => {
    try {
        const response = await http.get(`${API_ENDPOINT}/auth/check-email`, { params: { email } });
        return response.data.exists ? response.data.user : null;
    } catch (error) {
        console.error('Error checking user existence:', error);
        throw error;
    }
};
