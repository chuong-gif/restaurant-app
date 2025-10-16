import {
    FETCH_REVENUE_REQUEST,
    FETCH_REVENUE_SUCCESS,
    FETCH_REVENUE_FAILURE
} from '../Actions/RevenueTimeAction';

const initialState = {
    loading: false,
    revenueData: null, // đổi tên rõ nghĩa hơn
    error: '',
};

const revenueTimeReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_REVENUE_REQUEST:
            return { ...state, loading: true, error: '' };
        case FETCH_REVENUE_SUCCESS:
            return { ...state, loading: false, revenueData: action.payload };
        case FETCH_REVENUE_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default revenueTimeReducer;
