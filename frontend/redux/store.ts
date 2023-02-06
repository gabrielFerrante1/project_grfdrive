import { configureStore } from '@reduxjs/toolkit'; 
import storageReducer from './reducers/storageReducer';

export const store = configureStore({
    reducer: {
        storage: storageReducer, 
    },
});

export type RootState = ReturnType<typeof store.getState>; 