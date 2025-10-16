// Action Types
export const FETCH_PRODUCT_CATEGORY_REQUEST = 'FETCH_PRODUCT_CATEGORY_REQUEST';
export const FETCH_PRODUCT_CATEGORY_SUCCESS = 'FETCH_PRODUCT_CATEGORY_SUCCESS';
export const FETCH_PRODUCT_CATEGORY_FAILURE = 'FETCH_PRODUCT_CATEGORY_FAILURE';

import { API_ENDPOINT, API_DATA } from "../Config/Client/APIs";
import http from "../Utils/Http";

// Action Creators
export const fetchProductCategoryRequest = () => ({
    type: FETCH_PRODUCT_CATEGORY_REQUEST
});

export const fetchProductCategorySuccess = (product_category) => ({
    type: FETCH_PRODUCT_CATEGORY_SUCCESS,
    payload: product_category
});

export const fetchProductCategoryFailure = (error) => ({
    type: FETCH_PRODUCT_CATEGORY_FAILURE,
    payload: error
});

// Lấy tất cả danh mục sản phẩm
export const fetchProductCategory = () => {
    return (dispatch) => {
        dispatch(fetchProductCategoryRequest());
        http.get(`${API_ENDPOINT}/${API_DATA.categoryProduct}`)
            .then(response => {
                const product_category = response.data.results;
                dispatch(fetchProductCategorySuccess(product_category));
            })
            .catch(error => {
                const errorMsg = error.response?.data?.message || error.message;
                dispatch(fetchProductCategoryFailure(errorMsg));
            });
    };
};

// Lấy danh mục sản phẩm đang hoạt động
export const fetchProductCategoryHoatDong = () => {
    return (dispatch) => {
        dispatch(fetchProductCategoryRequest());
        http.get(`${API_ENDPOINT}/${API_DATA.categoryProduct}/hoat_dong`)
            .then(response => {
                const product_category = response.data.results;
                dispatch(fetchProductCategorySuccess(product_category));
            })
            .catch(error => {
                const errorMsg = error.response?.data?.message || error.message;
                dispatch(fetchProductCategoryFailure(errorMsg));
            });
    };
};

// Lấy danh sách danh mục (cho dropdown/menu)
export const fetchListProductCategory = () => {
    return (dispatch) => {
        dispatch(fetchProductCategoryRequest());
        http.get(`${API_ENDPOINT}/${API_DATA.categoryProduct}/danh_muc`)
            .then(response => {
                const product_category = response.data.results;
                dispatch(fetchProductCategorySuccess(product_category));
            })
            .catch(error => {
                const errorMsg = error.response?.data?.message || error.message;
                dispatch(fetchProductCategoryFailure(errorMsg));
            });
    };
};
