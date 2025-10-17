import type { ThunkAction } from "redux-thunk";
import type { AnyAction } from "redux";
import { API_ENDPOINT } from "../configs/client/APIs";
import AdminConfig from "../configs/client/index";
import http from "../Utils/Http";

// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_CUSTOMER_REQUEST = 'FETCH_CUSTOMER_REQUEST';
export const FETCH_CUSTOMER_SUCCESS = 'FETCH_CUSTOMER_SUCCESS';
export const FETCH_CUSTOMER_FAILURE = 'FETCH_CUSTOMER_FAILURE';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';

// ------------------------------
// 🔹 Interfaces
// ------------------------------
export interface Customer {
    id: number;
    fullname: string;
    email: string;
    phone?: string;
    address?: string;
    [key: string]: any;
}

export interface CustomerState {
    allCustomer: Customer[];
    customer: Customer[];
    currentPage: number;
    pageSize: number;
    loading: boolean;
    error: string;
    totalCount: number;
    totalPages: number;
}

interface FetchCustomerRequestAction {
    type: typeof FETCH_CUSTOMER_REQUEST;
}

interface FetchCustomerSuccessAction {
    type: typeof FETCH_CUSTOMER_SUCCESS;
    payload: {
        results: Customer[];
        totalCount: number;
        totalPages: number;
        currentPage: number;
    };
}

interface FetchCustomerFailureAction {
    type: typeof FETCH_CUSTOMER_FAILURE;
    payload: string;
}

interface SetCurrentPageAction {
    type: typeof SET_CURRENT_PAGE;
    payload: number;
}

export type CustomerActions =
    | FetchCustomerRequestAction
    | FetchCustomerSuccessAction
    | FetchCustomerFailureAction
    | SetCurrentPageAction;

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchCustomerRequest = (): FetchCustomerRequestAction => ({
    type: FETCH_CUSTOMER_REQUEST
});

export const fetchCustomerSuccess = (
    results: Customer[],
    totalCount: number,
    totalPages: number,
    currentPage: number
): FetchCustomerSuccessAction => ({
    type: FETCH_CUSTOMER_SUCCESS,
    payload: { results, totalCount, totalPages, currentPage }
});

export const fetchCustomerFailure = (error: string): FetchCustomerFailureAction => ({
    type: FETCH_CUSTOMER_FAILURE,
    payload: error
});

export const setCurrentPage = (page: number): SetCurrentPageAction => ({
    type: SET_CURRENT_PAGE,
    payload: page
});

// ------------------------------
// 🔹 Thunk Actions
// ------------------------------
export const fetchCustomer = (
    fullname = '',
    page = 1,
    pageSize = 5
): ThunkAction<void, CustomerState, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(fetchCustomerRequest());

        const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.customer}`);
        if (fullname) url.searchParams.append('search', fullname);
        url.searchParams.append('page', page.toString());
        url.searchParams.append('pageSize', pageSize.toString());

        try {
            const response = await http.get(url.toString());
            const { results, totalCount, totalPages, currentPage } = response.data;
            dispatch(fetchCustomerSuccess(results, totalCount, totalPages, currentPage));
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to fetch customers";
            dispatch(fetchCustomerFailure(errorMsg));
        }
    };
};

export const addCustomer = (
    customer: Partial<Customer>
): ThunkAction<void, CustomerState, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(fetchCustomerRequest());
        try {
            await http.post(`${API_ENDPOINT}/${AdminConfig.routes.customer}`, customer);
            dispatch(fetchCustomer());
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to add customer";
            dispatch(fetchCustomerFailure(errorMsg));
        }
    };
};

export const updateCustomer = (
    id: number,
    data: Partial<Customer>
): ThunkAction<void, CustomerState, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(fetchCustomerRequest());
        try {
            await http.patch(`${API_ENDPOINT}/${AdminConfig.routes.customer}/${id}`, data);
            dispatch(fetchCustomer());
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to update customer";
            dispatch(fetchCustomerFailure(errorMsg));
        }
    };
};

export const deleteCustomer = (
    id: number
): ThunkAction<void, CustomerState, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(fetchCustomerRequest());
        try {
            await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.customer}/${id}`);
            dispatch(fetchCustomer());
        } catch (error: any) {
            const errorMsg = error.message || "Failed to delete customer";
            dispatch(fetchCustomerFailure(errorMsg));
        }
    };
};

// ------------------------------
// 🔹 Utility function
// ------------------------------
export const checkEmailExists = async (email: string): Promise<Customer | null> => {
    try {
        const response = await http.get(`${API_ENDPOINT}/auth/check-email`, { params: { email } });
        return response.data.exists ? response.data.user : null;
    } catch (error) {
        console.error('Error checking user existence:', error);
        throw error;
    }
};
