import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import {config} from './userSlice'

interface ForecastWithFlags {
  color: string;
  descr: string;
  ext_desc: string;
  forecast_id: number;
  image: string;
  input: string;
  measure_type: string;
  result: string;
  short_title: string;
  title: string;
}

interface PredictionData {
  prediction_window?: number | null;
  predictions_amount?: number | null;
  Date_completed?: string | null;
  Date_created?: string | null;
  Date_formed?: string | null;
  Status?: string | null;
}

interface PredictionDraftState {
  prediction_id?: number;
  count: number | undefined;

  forecasts: ForecastWithFlags[]; // массив услуг
  predictionData: PredictionData; // поля заявки
  error: string | null;
}

const initialState: PredictionDraftState = {
  prediction_id: NaN,
  count: NaN,

  forecasts: [],
  predictionData: {
    prediction_window: 0,
    predictions_amount: 0,
    Date_completed: null,
    Date_created:  null,
    Date_formed: null,
    Status: null,
  },
  error: null,
};

export const getPrediction = createAsyncThunk(
  'prediction/predictionDetail',
  async (prId: number) => {
    const response = await api.prediction.predictionDetail(prId, config)
    return response.data;
  }
);

export const addForecastToPrediction = createAsyncThunk(
  'prediction/addForecastToPrediction',
  async (fId: number) => {
    const response = await api.forecast.toPredCreate(fId, config);
    return response.data;
  }
);

const predictionDraftSlice = createSlice({
  name: 'predictionDraft',
  initialState,
  reducers: {
    setPredictionDraftID: (state, action) => {
      state.prediction_id = action.payload;
    },
    setCount: (state, action) => {
      state.count = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPrediction.fulfilled, (state, action) => {
        const { prediction, forecasts } = action.payload;
        if (prediction && forecasts) {
            state.prediction_id = prediction.prediction_id;
            state.predictionData = {
                prediction_window: prediction.prediction_window,
                predictions_amount: prediction.prediction_amount,
                Status: prediction.status,
                Date_created: prediction.date_created,
                Date_completed: prediction.date_completed,
                Date_formed: prediction.date_formed,
            };
            state.forecasts = forecasts || [];
        }
      })
      .addCase(addForecastToPrediction.fulfilled, (state, action) => {
        state.count = action.payload.forecasts.length
      })
      .addCase(getPrediction.rejected, (state) => {
        state.error = 'Ошибка при загрузке данных';
      });
  }
});

export const {setPredictionDraftID, setCount} = predictionDraftSlice.actions;
export default predictionDraftSlice.reducer;