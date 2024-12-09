import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, OTP_FAILURE, OTP_SENT,CREATE_PASSWORD_FAILURE, CREATE_PASSWORD_SUCCESS, RESET_PASSWORD_FAILURE, RESET_PASSWORD_SUCCESS } from '../actions/types';

const initialState = {
    isAuthenticated: false,
    token: null,
    error: null,
};

export default function authReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                token: payload.token,
                error: null
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                isAuthenticated: false,
                token: null,
                error: payload
            };
        case LOGOUT:
            return {
                ...state,
                isAuthenticated: false,
                token: null,
                error: null
            };
        case OTP_SENT:
        case OTP_FAILURE:
            return {
                ...state,
                error: payload
            };
        case CREATE_PASSWORD_SUCCESS:
        case CREATE_PASSWORD_FAILURE:
            return {
                ...state,
                error: payload
            };
        case RESET_PASSWORD_SUCCESS:
        case RESET_PASSWORD_FAILURE:
            return {
                ...state,
                error: payload
            };
        default:
            return state;
    }
}
