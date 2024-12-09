import { VIS_UPDATE_SUCCESS } from "../actions/types";

const initialState = {
    vis_data: [],
};

export default function dataReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case VIS_UPDATE_SUCCESS:
            return {
                ...state,
                vis_data: [...state.vis_data, payload],
            };
        case "SET_VIS_DATA":
            return {
                ...state,
                vis_data: payload,
            };
        default:
            return state;
    }
}