// Action Types
export const FETCH_PRODUCT_CATEGORY_REQUEST = 'FETCH_PRODUCT_CATEGORY_REQUEST';
export const FETCH_PRODUCT_CATEGORY_SUCCESS = 'FETCH_PRODUCT_CATEGORY_SUCCESS';
export const FETCH_PRODUCT_CATEGORY_FAILURE = 'FETCH_PRODUCT_CATEGORY_FAILURE';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const SET_LIMIT = 'SET_LIMIT';

import { API_ENDPOINT } from "../Config/APIs";
import AdminConfig from '../Config/index';
import http from "../Utils/Http';

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchProductCategoryRequest = () => ({ type: FETCH_PRODUCT_CATEGORY_REQUEST });
export const fetchProductCategorySuccess = (results, totalCount = 0, totalPages = 0, currentPage = 1) => ({
  type: FETCH_PRODUCT_CATEGORY_SUCCESS,
  payload: { results, totalCount, totalPages, currentPage }
});
export const fetchProductCategoryFailure = (error) => ({ type: FETCH_PRODUCT_CATEGORY_FAILURE, payload: error });
export const setCurrentPage = (page) => ({ type: SET_CURRENT_PAGE, payload: page });
export const setLimit = (limit) => ({ type: SET_LIMIT, payload: limit });

// ------------------------------
// 🔹 Thunks
// ------------------------------

// Hàm chung để fetch category
const fetchCategory = (endpoint = '', name = '', status = '', page = 1, pageSize = 10) => {
  return async dispatch => {
    dispatch(fetchProductCategoryRequest());
    try {
      const limit = parseInt(localStorage.getItem('limit'), 10) || pageSize;
      const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.categoryProduct}${endpoint ? '/' + endpoint : ''}`);
      if (name) url.searchParams.append('search', name);
      if (status) url.searchParams.append('searchStatus', status);
      url.searchParams.append('page', page);
      url.searchParams.append('limit', limit);

      const response = await http.get(url.toString());
      const { results, totalCount, totalPages, currentPage } = response.data;
      dispatch(fetchProductCategorySuccess(results, totalCount, totalPages, currentPage));
    } catch (error) {
      dispatch(fetchProductCategoryFailure(error.response?.data?.message || error.message));
    }
  };
};

// Fetch tất cả category
export const fetchProductCategory = (name = '', status = '', page = 1, pageSize = 10) =>
  fetchCategory('', name, status, page, pageSize);

// Fetch category hoat dong
export const fetchProductCategoryHoatDong = (name = '', page = 1, pageSize = 10) =>
  fetchCategory('hoat_dong', name, '', page, pageSize);

// Fetch danh sách category không phân trang (danh_muc)
export const fetchListProductCategory = () => {
  return async dispatch => {
    dispatch(fetchProductCategoryRequest());
    try {
      const response = await http.get(`${API_ENDPOINT}/${AdminConfig.routes.categoryProduct}/danh_muc`);
      dispatch(fetchProductCategorySuccess(response.data.results));
    } catch (error) {
      dispatch(fetchProductCategoryFailure(error.response?.data?.message || error.message));
    }
  };
};

// Add category
export const addProductCategory = (product) => {
  return async dispatch => {
    dispatch(fetchProductCategoryRequest());
    try {
      await http.post(`${API_ENDPOINT}/${AdminConfig.routes.categoryProduct}`, product);
      dispatch(fetchProductCategory()); // reload danh mục
    } catch (error) {
      dispatch(fetchProductCategoryFailure(error.response?.data?.message || error.message));
    }
  };
};

// Update category
export const updateProductCategory = (id, data) => {
  return async dispatch => {
    dispatch(fetchProductCategoryRequest());
    try {
      await http.patch(`${API_ENDPOINT}/${AdminConfig.routes.categoryProduct}/${id}`, data);
      dispatch(fetchProductCategory()); // reload danh mục
    } catch (error) {
      dispatch(fetchProductCategoryFailure(error.response?.data?.message || error.message));
    }
  };
};

// Delete category
export const deleteProductCategory = (id, name = '', page = 1, pageSize = 10) => {
  return async dispatch => {
    dispatch(fetchProductCategoryRequest());
    try {
      await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.categoryProduct}/${id}`);
      dispatch(fetchProductCategory(name, '', page, pageSize)); // reload danh mục
    } catch (error) {
      dispatch(fetchProductCategoryFailure(error.response?.data?.message || error.message));
    }
  };
};
