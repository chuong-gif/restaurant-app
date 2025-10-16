// Action Types
export const FETCH_CONTACT_REQUEST = "FETCH_CONTACT_REQUEST";
export const FETCH_CONTACT_SUCCESS = "FETCH_CONTACT_SUCCESS";
export const FETCH_CONTACT_FAILURE = "FETCH_CONTACT_FAILURE";

import { API_ENDPOINT, API_DATA } from "../Config/Client/APIs";
import http from "../Utils/Http";

// Action Creators
export const fetchContactRequest = () => ({
    type: FETCH_CONTACT_REQUEST
});

export const fetchContactSuccess = (contact) => ({
    type: FETCH_CONTACT_SUCCESS,
    payload: contact
});

export const fetchContactFailure = (error) => ({
    type: FETCH_CONTACT_FAILURE,
    payload: error
});

// Add New Contact
export const addNewContact = (contactData) => {
    return (dispatch) => {
        dispatch(fetchContactRequest());
        http.post(`${API_ENDPOINT}${API_DATA.contact}`, contactData)
            .then((response) => {
                dispatch(fetchContactSuccess(response.data));
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.message || error.message;
                dispatch(fetchContactFailure(errorMsg));
            });
    };
};
