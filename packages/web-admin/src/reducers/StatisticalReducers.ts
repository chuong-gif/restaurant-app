import {
    FETCH_STATISTICAL_REQUEST,
    FETCH_STATISTICAL_SUCCESS,
    FETCH_STATISTICAL_FAILURE
} from '../Actions/StatisticalActions';

const initialState = {
    loading: false,
    data: null,
    error: ''
};

const StatisticalReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_STATISTICAL_REQUEST:
            return { ...state, loading: true, error: '' };
        case FETCH_STATISTICAL_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case FETCH_STATISTICAL_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default StatisticalReducer;
