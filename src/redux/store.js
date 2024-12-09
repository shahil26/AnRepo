// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

// Create the store with configureStore
const store = configureStore({
  reducer: rootReducer
});

export default store;
