import { combineReducers, configureStore } from '@reduxjs/toolkit';
import filterReducer from './slices/filterSlice';
import modeReducer from './slices/modeSlice';


const store = configureStore({
    reducer: combineReducers({
        filter: filterReducer,
        mode: modeReducer,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;