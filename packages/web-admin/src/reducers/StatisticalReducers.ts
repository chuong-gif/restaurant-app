import {
    FETCH_STATISTICAL_REQUEST,
    FETCH_STATISTICAL_SUCCESS,
    FETCH_STATISTICAL_FAILURE
} from '../action/StatisticalActions';

// Kiểu cho action
interface StatisticalAction {
    type: string;
    payload?: any;
}

// Kiểu cho state
interface StatisticalState {
    loading: boolean;
    data: any | null;
    error: string;
}

const initialState: StatisticalState = {
    loading: false,
    data: null,
    error: ''
};

const StatisticalReducer = (
    state: StatisticalState = initialState,
    action: StatisticalAction
): StatisticalState => {
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
