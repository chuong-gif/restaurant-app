import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { API_ENDPOINT } from "../Config/APIs";
import AdminConfig from "../Config/index";
import http from "../Utils/Http";

// ------------------------------
// 🔹 Action Types
// ------------------------------
export const FETCH_COMMENTBLOG_REQUEST = 'FETCH_COMMENTBLOG_REQUEST';
export const FETCH_COMMENTBLOG_SUCCESS = 'FETCH_COMMENTBLOG_SUCCESS';
export const FETCH_COMMENTBLOG_FAILURE = 'FETCH_COMMENTBLOG_FAILURE';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const SET_LIMIT = 'SET_LIMIT';

// ------------------------------
// 🔹 Interfaces
// ------------------------------
export interface CommentBlog {
    id: number;
    blog_id: number;
    content: string;
    author: string;
    createdAt?: string;
    [key: string]: any;
}

export interface CommentBlogState {
    allCommentBlog: CommentBlog[];
    commentBlog: CommentBlog[];
    currentPage: number;
    pageSize: number;
    loading: boolean;
    error: string;
    totalCount: number;
    totalPages: number;
}

interface FetchCommentBlogRequestAction {
    type: typeof FETCH_COMMENTBLOG_REQUEST;
}

interface FetchCommentBlogSuccessAction {
    type: typeof FETCH_COMMENTBLOG_SUCCESS;
    payload: {
        results: CommentBlog[];
        totalCount: number;
        totalPages: number;
        currentPage: number;
    };
}

interface FetchCommentBlogFailureAction {
    type: typeof FETCH_COMMENTBLOG_FAILURE;
    payload: string;
}

interface SetCurrentPageAction {
    type: typeof SET_CURRENT_PAGE;
    payload: number;
}

interface SetLimitAction {
    type: typeof SET_LIMIT;
    payload: number;
}

export type CommentBlogActions =
    | FetchCommentBlogRequestAction
    | FetchCommentBlogSuccessAction
    | FetchCommentBlogFailureAction
    | SetCurrentPageAction
    | SetLimitAction;

// ------------------------------
// 🔹 Action Creators
// ------------------------------
export const fetchCommentBlogRequest = (): FetchCommentBlogRequestAction => ({
    type: FETCH_COMMENTBLOG_REQUEST
});

export const fetchCommentBlogSuccess = ({
    results, totalCount, totalPages, currentPage
}: {
    results: CommentBlog[],
    totalCount: number,
    totalPages: number,
    currentPage: number
}): FetchCommentBlogSuccessAction => ({
    type: FETCH_COMMENTBLOG_SUCCESS,
    payload: { results, totalCount, totalPages, currentPage }
});

export const fetchCommentBlogFailure = (error: string): FetchCommentBlogFailureAction => ({
    type: FETCH_COMMENTBLOG_FAILURE,
    payload: error
});

export const setCurrentPage = (page: number): SetCurrentPageAction => ({
    type: SET_CURRENT_PAGE,
    payload: page
});

export const setLimit = (limit: number): SetLimitAction => ({
    type: SET_LIMIT,
    payload: limit
});

// ------------------------------
// 🔹 Thunk Actions
// ------------------------------
export const fetchCommentBlog = (
    blog_id: number,
    page = 1
): ThunkAction<void, CommentBlogState, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(fetchCommentBlogRequest());
        const limit = parseInt(localStorage.getItem('limit') || '5', 10);

        try {
            const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.commentBlog}/blog/${blog_id}`);
            url.searchParams.append('page', page.toString());
            url.searchParams.append('limit', limit.toString());

            const response = await http.get(url.toString());
            const { results, totalCount, totalPages, currentPage } = response.data;
            dispatch(fetchCommentBlogSuccess({ results, totalCount, totalPages, currentPage }));
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to fetch comments";
            dispatch(fetchCommentBlogFailure(errorMsg));
        }
    };
};

export const addCommentBlog = (
    commentblog: CommentBlog
): ThunkAction<void, CommentBlogState, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(fetchCommentBlogRequest());
        try {
            await http.post(`${API_ENDPOINT}/${AdminConfig.routes.commentBlog}`, commentblog);
            dispatch(fetchCommentBlog(commentblog.blog_id));
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to add comment";
            dispatch(fetchCommentBlogFailure(errorMsg));
        }
    };
};

export const updateCommentBlog = (
    id: number,
    data: Partial<CommentBlog>
): ThunkAction<void, CommentBlogState, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(fetchCommentBlogRequest());
        try {
            await http.patch(`${API_ENDPOINT}/${AdminConfig.routes.commentBlog}/${id}`, data);
            if (data.blog_id) {
                dispatch(fetchCommentBlog(data.blog_id));
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to update comment";
            dispatch(fetchCommentBlogFailure(errorMsg));
        }
    };
};

export const deleteCommentBlog = (
    id: number,
    blogId: number
): ThunkAction<void, CommentBlogState, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(fetchCommentBlogRequest());
        try {
            await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.commentBlog}/${id}`);
            dispatch(fetchCommentBlog(blogId));
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to delete comment";
            dispatch(fetchCommentBlogFailure(errorMsg));
        }
    };
};
