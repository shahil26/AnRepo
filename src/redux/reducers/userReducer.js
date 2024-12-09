import {LOGIN_SUCCESS, OVERVIEW_SUCCESS, UPDATE_SUCCESS } from '../actions/types';

const initialState = {
    instituteId: null,
    email: null,
    name: null,
    roles: [],
    notifications: null,
    recents: null,
    image: null,
    keepunsaved: false,
};

export default function userReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                instituteId: payload.institute_id,
                email: payload.email,
                roles: payload.roles,
                name: payload.name,
                image: payload.image,
                keepunsaved: payload.keepunsaved,
            };
        case OVERVIEW_SUCCESS:
            return {
                ...state,
                notifications: payload || [],
                recents: payload || [],
                trash: payload || [],
                workManager: payload || [],
            };
        case UPDATE_SUCCESS:
            return {
                ...state,
                name: payload.name || state.name,
                keepunsaved: payload.keepunsaved || state.keepunsaved,
            };
        
        default:
            return state;
    }
}
