import { combineReducers } from 'redux';
import authReducer from './authReducer';
import userReducer from './userReducer';
import dataReducer from './dataReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    data: dataReducer,
});

export default rootReducer;
