import {
    FETCH_REVENUE_REQUEST,
    FETCH_REVENUE_SUCCESS,
    FETCH_REVENUE_FAILURE
} from '../action/RevenueTimeAction';

// Kiểu cho action
interface RevenueTimeAction {
    type: string;
    payload?: any;
}

// Kiểu cho state
interface RevenueTimeState {
    loading: boolean;
    revenueData: any | null;
    error: string;
}

const initialState: RevenueTimeState = {
    loading: false,
    revenueData: null,
    error: '',
};

const revenueTimeReducer = (
    state: RevenueTimeState = initialState,
    action: RevenueTimeAction
): RevenueTimeState => {
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
