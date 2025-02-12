import { combineReducers, configureStore } from '@reduxjs/toolkit';
import modeReducer from './slices/modeSlice';
import forecastsReducer from './slices/forecastsSlice'
import userReducer from './slices/userSlice';
import predictionDraftReducer from './slices/predictionDraftSlice'
import regReducer from './slices/regSlice'
import predictionsFilterReducer from './slices/predFilterSlice'


const store = configureStore({
    reducer: combineReducers({
        mode: modeReducer,
        forecasts: forecastsReducer,
        user: userReducer,
        predictionDraft: predictionDraftReducer,
        reg: regReducer,
        predictionsFilter: predictionsFilterReducer
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;