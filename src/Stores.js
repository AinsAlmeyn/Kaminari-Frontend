import { configureStore } from '@reduxjs/toolkit';
import appReducer from './Slices';

export const store = configureStore({
    reducer: {
        app: appReducer
    }
});