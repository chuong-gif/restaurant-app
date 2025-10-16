// Action Types
export const FETCH_PERMISSIONS_REQUEST = 'FETCH_PERMISSIONS_REQUEST';
export const FETCH_PERMISSIONS_SUCCESS = 'FETCH_PERMISSIONS_SUCCESS';
export const FETCH_PERMISSIONS_FAILURE = 'FETCH_PERMISSIONS_FAILURE';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';

import { API_ENDPOINT } from "../Config/APIs";
import AdminConfig from '../Config/index';
import http from "../Utils/Http";

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchPermissionsRequest = () => ({
    type: FETCH_PERMISSIONS_REQUEST
});

export const fetchPermissionsSuccess = (results, totalCount = 0, totalPages = 0, currentPage = 1) => ({
    type: FETCH_PERMISSIONS_SUCCESS,
    payload: { results, totalCount, totalPages, currentPage }
});

export const fetchPermissionsFailure = (error) => ({
    type: FETCH_PERMISSIONS_FAILURE,
    payload: error
});

export const setCurrentPage = (page) => ({
    type: SET_CURRENT_PAGE,
    payload: page
});

// ------------------------------
// 🔹 Thunks
// ------------------------------

// Fetch all permissions
export const fetchPermissions = () => {
    return async dispatch => {
        dispatch(fetchPermissionsRequest());
        try {
            const url = `${API_ENDPOINT}/${AdminConfig.routes.permissions}`;
            const response = await http.get(url);
            const { results, totalCount, totalPages, currentPage } = response.data;
            dispatch(fetchPermissionsSuccess(results, totalCount, totalPages, currentPage));
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to fetch permissions";
            dispatch(fetchPermissionsFailure(errorMsg));
        }
    };
};

// Fetch permissions by role with optional search
export const fetchPermissionsByRole = (roleId, name = '') => {
    return async dispatch => {
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
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            dispatch(fetchPermissionsFailure(errorMsg));
        }
    };
};

// Add a new permission
export const addPermissions = (permissions) => {
    return async dispatch => {
        dispatch(fetchPermissionsRequest());
        try {
            await http.post(`${API_ENDPOINT}/${AdminConfig.routes.permissions}`, permissions);
            // Refresh after add
            dispatch(fetchPermissions());
        } catch (error) {
            if (error.response?.status === 409) {
                throw new Error("Duplicate entry");
            } else {
                throw error;
            }
        }
    };
};

// Update a permission by ID
export const updatePermissions = (id, data) => {
    return async dispatch => {
        dispatch(fetchPermissionsRequest());
        try {
            await http.patch(`${API_ENDPOINT}/${AdminConfig.routes.permissions}/${id}`, data);
            dispatch(fetchPermissions());
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            dispatch(fetchPermissionsFailure(errorMsg));
        }
    };
};

// Delete a permission by ID
export const deletePermissions = (id) => {
    return async dispatch => {
        dispatch(fetchPermissionsRequest());
        try {
            await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.permissions}/${id}`);
            dispatch(fetchPermissions());
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            dispatch(fetchPermissionsFailure(errorMsg));
        }
    };
};
