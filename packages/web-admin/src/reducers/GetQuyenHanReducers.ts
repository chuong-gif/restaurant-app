import {
    FETCH_QUYEN_HAN_REQUEST,
    FETCH_QUYEN_HAN_SUCCESS,
    FETCH_QUYEN_HAN_FAILURE,
} from "../action/GetQuyenHanAction";

// Kiểu cho action
interface GetQuyenHanAction {
    type: string;
    payload?: any;
}

// Kiểu cho state
interface GetQuyenHanState {
    loading: boolean;
    getQuyenHan: any | null;
    error: string;
}

const initialState: GetQuyenHanState = {
    loading: false,
    getQuyenHan: null,
    error: '',
};

const getQuyenHanReducer = (
    state: GetQuyenHanState = initialState, 
    action: GetQuyenHanAction
): GetQuyenHanState => {
    switch (action.type) {
        case FETCH_QUYEN_HAN_REQUEST:
            return {
                ...state,
                loading: true,
                error: ''
            };
        case FETCH_QUYEN_HAN_SUCCESS:
            return {
                ...state,
                loading: false,
                getQuyenHan: action.payload,
                error: ''
            };
        case FETCH_QUYEN_HAN_FAILURE:
            return {
                ...state,
                loading: false,
                getQuyenHan: null,
                error: action.payload
            };
        default:
            return state;
    }
};

export default getQuyenHanReducer;
