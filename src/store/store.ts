import { combineReducers, configureStore } from '@reduxjs/toolkit';
import modeReducer from './slices/modeSlice';
import forecastsReducer from './slices/forecastsSlice'
import userReducer from './slices/userSlice';
import predictionDraftReducer from './slices/predictionDraftSlice'


const store = configureStore({
    reducer: combineReducers({
        mode: modeReducer,
        forecasts: forecastsReducer,
        user: userReducer,
        predictionDraft: predictionDraftReducer
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;