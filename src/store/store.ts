import { combineReducers, configureStore } from '@reduxjs/toolkit';
import modeReducer from './slices/modeSlice';
import forecastsReducer from './slices/forecastsSlice'


const store = configureStore({
    reducer: combineReducers({
        mode: modeReducer,
        forecasts: forecastsReducer
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;