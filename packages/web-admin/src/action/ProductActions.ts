// Action Types
export const FETCH_PRODUCT_REQUEST = "FETCH_PRODUCT_REQUEST";
export const FETCH_PRODUCT_SUCCESS = "FETCH_PRODUCT_SUCCESS";
export const FETCH_PRODUCT_FAILURE = "FETCH_PRODUCT_FAILURE";
export const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";
export const SET_LIMIT = "SET_LIMIT";

import { API_ENDPOINT } from "../Config/APIs";
import AdminConfig from "../Config/index";
import http from "../Utils/Http";

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchProductRequest = () => ({ type: FETCH_PRODUCT_REQUEST });
export const fetchProductSuccess = (results, totalCount = 0, totalPages = 0, currentPage = 1) => ({
  type: FETCH_PRODUCT_SUCCESS,
  payload: { results, totalCount, totalPages, currentPage }
});
export const fetchProductFailure = (error) => ({ type: FETCH_PRODUCT_FAILURE, payload: error });
export const setCurrentPage = (page) => ({ type: SET_CURRENT_PAGE, payload: page });
export const setLimit = (limit) => ({ type: SET_LIMIT, payload: limit });

// ------------------------------
// 🔹 Thunks
// ------------------------------

// Fetch products with optional search, pagination, and active filter
export const fetchProduct = async (name = "", page = 1, pageSize = 10, activeStatus = null) => {
  return async dispatch => {
    dispatch(fetchProductRequest());
    try {
      const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.product}`);
      if (name) url.searchParams.append("search", name);
      url.searchParams.append("page", page);
      url.searchParams.append("pageSize", pageSize);
      if (activeStatus !== null) url.searchParams.append("status", activeStatus);

      const response = await http.get(url.toString());
      const { results, totalCount, totalPages, currentPage } = response.data;
      dispatch(fetchProductSuccess(results, totalCount, totalPages, currentPage));
    } catch (error) {
      dispatch(fetchProductFailure(error.response?.data?.message || error.message));
    }
  };
};

// Fetch menu products (no pagination)
export const fetchMenu = () => {
  return async dispatch => {
    dispatch(fetchProductRequest());
    try {
      const response = await http.get(`${API_ENDPOINT}/${AdminConfig.routes.product}/menu`);
      dispatch(fetchProductSuccess(response.data.results));
    } catch (error) {
      dispatch(fetchProductFailure(error.response?.data?.message || error.message));
    }
  };
};

// Fetch active or inactive products
const fetchProductByStatus = (statusEndpoint, name = "", categoryId = "", page = 1, pageSize = 10) => {
  return async dispatch => {
    dispatch(fetchProductRequest());
    try {
      const limit = parseInt(localStorage.getItem("limit"), 10) || pageSize;
      const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.product}/${statusEndpoint}`);
      if (name) url.searchParams.append("searchName", name);
      if (categoryId) url.searchParams.append("searchCateID", categoryId);
      url.searchParams.append("page", page);
      url.searchParams.append("limit", limit);

      const response = await http.get(url.toString());
      const { results, totalCount, totalPages, currentPage } = response.data;
      dispatch(fetchProductSuccess(results, totalCount, totalPages, currentPage));
    } catch (error) {
      dispatch(fetchProductFailure(error.response?.data?.message || error.message));
    }
  };
};

export const fetchProductHoatDong = (name, categoryId, page, pageSize) =>
  fetchProductByStatus("hoat_dong", name, categoryId, page, pageSize);
export const fetchProductNgungHoatDong = (name, categoryId, page, pageSize) =>
  fetchProductByStatus("ngung_hoat_dong", name, categoryId, page, pageSize);

// Add product
export const addProduct = (product) => {
  return async dispatch => {
    dispatch(fetchProductRequest());
    try {
      await http.post(`${API_ENDPOINT}/${AdminConfig.routes.product}`, product);
      dispatch(fetchProductHoatDong()); // reload active products
    } catch (error) {
      dispatch(fetchProductFailure(error.response?.data?.message || error.message));
    }
  };
};

// Update product
export const updateProduct = (id, data) => {
  return async dispatch => {
    dispatch(fetchProductRequest());
    try {
      await http.patch(`${API_ENDPOINT}/${AdminConfig.routes.product}/${id}`, data);
      dispatch(fetchProductHoatDong()); // reload active products
    } catch (error) {
      dispatch(fetchProductFailure(error.response?.data?.message || error.message));
    }
  };
};

// Update product status (active/inactive)
export const updateStatus = (id, data, start = "list", name = "", categoryId = "", page = 1, pageSize = 10) => {
  return async dispatch => {
    dispatch(fetchProductRequest());
    try {
      await http.patch(`${API_ENDPOINT}/${AdminConfig.routes.product}/${id}`, data);
      if (start === "list") {
        dispatch(fetchProductHoatDong(name, categoryId, page, pageSize));
      } else {
        dispatch(fetchProductNgungHoatDong(name, categoryId, page, pageSize));
      }
    } catch (error) {
      dispatch(fetchProductFailure(error.response?.data?.message || error.message));
    }
  };
};

// Delete product
export const deleteProduct = (id) => {
  return async dispatch => {
    dispatch(fetchProductRequest());
    try {
      await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.product}/${id}`);
      dispatch(fetchProduct()); // reload all products
    } catch (error) {
      dispatch(fetchProductFailure(error.response?.data?.message || error.message));
    }
  };
};
