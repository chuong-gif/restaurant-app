// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_PERMISSIONS_REQUEST = 'FETCH_PERMISSIONS_REQUEST';
export const FETCH_PERMISSIONS_SUCCESS = 'FETCH_PERMISSIONS_SUCCESS';
export const FETCH_PERMISSIONS_FAILURE = 'FETCH_PERMISSIONS_FAILURE';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';

import { API_ENDPOINT } from "../configs/client/APIs";
import AdminConfig from '../configs/client/index';
import http from "../Utils/Http";
import type { Dispatch } from "redux";
import type { ThunkAction } from "redux-thunk";

// ------------------------------
// 🔹 Type Definitions
// ------------------------------
export interface Permission {
    id: string;
    name: string;
    [key: string]: any;
}

export interface PermissionsState {
    results: Permission[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    loading?: boolean;
    error?: string;
}

export type PermissionsAction =
    | { type: typeof FETCH_PERMISSIONS_REQUEST }
    | { type: typeof FETCH_PERMISSIONS_SUCCESS; payload: PermissionsState }
    | { type: typeof FETCH_PERMISSIONS_FAILURE; payload: string }
    | { type: typeof SET_CURRENT_PAGE; payload: number };

export type AppThunk<ReturnType = void> = ThunkAction<
    Promise<ReturnType>,
    PermissionsState,
    unknown,
    PermissionsAction
>;

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchPermissionsRequest = (): PermissionsAction => ({
    type: FETCH_PERMISSIONS_REQUEST
});

export const fetchPermissionsSuccess = (
    results: Permission[],
    totalCount = 0,
    totalPages = 0,
    currentPage = 1
): PermissionsAction => ({
    type: FETCH_PERMISSIONS_SUCCESS,
    payload: { results, totalCount, totalPages, currentPage }
});

export const fetchPermissionsFailure = (error: string): PermissionsAction => ({
    type: FETCH_PERMISSIONS_FAILURE,
    payload: error
});

export const setCurrentPage = (page: number): PermissionsAction => ({
    type: SET_CURRENT_PAGE,
    payload: page
});

// ------------------------------
// 🔹 Thunks
// ------------------------------
export const fetchPermissions = (): AppThunk => {
    return async (dispatch: Dispatch<PermissionsAction>) => {
        dispatch(fetchPermissionsRequest());
        try {
            const url = `${API_ENDPOINT}/${AdminConfig.routes.permissions}`;
            const response = await http.get(url);
            const { results, totalCount, totalPages, currentPage } = response.data;
            dispatch(fetchPermissionsSuccess(results, totalCount, totalPages, currentPage));
        } catch (error: unknown) {
            const errorMsg =
                (error as any)?.response?.data?.message ||
                (error as Error).message ||
                "Failed to fetch permissions";
            dispatch(fetchPermissionsFailure(errorMsg));
        }
    };
};

export const fetchPermissionsByRole = (roleId: string, name = ''): AppThunk => {
    return async (dispatch: Dispatch<PermissionsAction>) => {
        if (!roleId) {
            dispatch(fetchPermissionsFailure('Role ID is required'));
            return;
        }

        dispatch(fetchPermissionsRequest());
        try {
            const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.permissions}`);
            url.searchParams.append('role_id', roleId);
            if (name) url.searchParams.append('search', name);

            const response = await http.get(url.toString());
            dispatch(fetchPermissionsSuccess(response.data.results));
        } catch (error: unknown) {
            const errorMsg =
                (error as any)?.response?.data?.message ||
                (error as Error).message ||
                "Failed to fetch permissions by role";
            dispatch(fetchPermissionsFailure(errorMsg));
        }
    };
};

export const addPermissions = (permissions: Permission): AppThunk => {
    return async (dispatch: Dispatch<PermissionsAction>) => {
        dispatch(fetchPermissionsRequest());
        try {
            await http.post(`${API_ENDPOINT}/${AdminConfig.routes.permissions}`, permissions);
            await dispatch(fetchPermissions() as any); // ✅ fix lỗi TS2345
        } catch (error: unknown) {
            const err = error as any;
            if (err.response?.status === 409) {
                throw new Error("Duplicate entry");
            } else {
                throw err;
            }
        }
    };
};

export const updatePermissions = (id: string, data: Partial<Permission>): AppThunk => {
    return async (dispatch: Dispatch<PermissionsAction>) => {
        dispatch(fetchPermissionsRequest());
        try {
            await http.patch(`${API_ENDPOINT}/${AdminConfig.routes.permissions}/${id}`, data);
            await dispatch(fetchPermissions() as any); // ✅ fix lỗi TS2345
        } catch (error: unknown) {
            const errorMsg =
                (error as any)?.response?.data?.message ||
                (error as Error).message ||
                "Failed to update permission";
            dispatch(fetchPermissionsFailure(errorMsg));
        }
    };
};

export const deletePermissions = (id: string): AppThunk => {
    return async (dispatch: Dispatch<PermissionsAction>) => {
        dispatch(fetchPermissionsRequest());
        try {
            await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.permissions}/${id}`);
            await dispatch(fetchPermissions() as any); // ✅ fix lỗi TS2345
        } catch (error: unknown) {
            const errorMsg =
                (error as any)?.response?.data?.message ||
                (error as Error).message ||
                "Failed to delete permission";
            dispatch(fetchPermissionsFailure(errorMsg));
        }
    };
};
