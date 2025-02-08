import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import {returnHeaderConfig,logoutUserAsync} from './userSlice'
import { DsUpdatePredForecInput } from '../../api/Api';

interface Measure {
  index?: number
  value?: string | null
}

interface ForecastWithFlags {
  measurements?: Measure[];
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

export const getPredictions = createAsyncThunk(
  'prediction/predictionDetail',
  async ({ status, start_date, end_date }: { status: string; start_date: string, end_date: string }) => {
    const response = await api.predictions.predictionsList({status, start_date, end_date}, returnHeaderConfig())
    return response.data;
  }
);

export const getPrediction = createAsyncThunk(
  'prediction/predictionDetail',
  async (prId: number) => {
    const response = await api.prediction.predictionDetail(prId, returnHeaderConfig())
    return response.data;
  }
);

export const addForecastToPrediction = createAsyncThunk(
  'prediction/addForecastToPrediction',
  async (fId: number) => {
    const response = await api.forecast.toPredCreate(fId, returnHeaderConfig());
    return response.data;
  }
);

export const deletePrediction= createAsyncThunk(
  'prediction/deletePrediction',
  async (prId: string) => {
    const response = await api.prediction.deleteDelete(Number(prId), returnHeaderConfig());
    return response.data;
  }
);

export const formPrediction= createAsyncThunk(
  'prediction/formPrediction',
  async (prId: string) => {
    const response = await api.prediction.formUpdate(Number(prId), returnHeaderConfig());
    return response.data;
  }
);

export const updatePrediction = createAsyncThunk(
  'prediction/updatePrediction',
  async ({ prId, predictionData }: { prId: string; predictionData: PredictionData }) => {
    const predictionDataToSend = {
      prediction_amount: Number(predictionData.predictions_amount) ?? 0, 
      prediction_window: Number(predictionData.prediction_window) ?? 0,
    };
    const response = await api.prediction.editUpdate(Number(prId), predictionDataToSend, returnHeaderConfig());
    return response.data;
  }
);

export const deleteForecastFromPrediction = createAsyncThunk(
  'prediction/deleteForecastFromPrediction',
  async ({ prediction_id, forecast_id }: { prediction_id: number; forecast_id: number }) => {
    await api.prFc.removeDelete(
      forecast_id,
      prediction_id,
      returnHeaderConfig()
    ); 
  }
);

export const editForecastInPrediction = createAsyncThunk(
  'prediction/editForecastInPrediction',
  async ({ prediction_id, forecast_id, inp }: { prediction_id: number; forecast_id: number, inp: string }) => {
    let i : DsUpdatePredForecInput = {
      input: inp
    }
    await api.prFc.editUpdate(
      forecast_id,
      prediction_id,
      i,
      returnHeaderConfig()
    ); 
  }
);

const predictionDraftSlice = createSlice({
  name: 'predictionDraft',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    setPredictionDraftID: (state, action) => {
      state.prediction_id = action.payload;
    },
    setCount: (state, action) => {
      state.count = action.payload;
    },
    setWindow: (state, action) => {
      state.predictionData.prediction_window = action.payload
    },
    setAmount: (state, action) => {
      state.predictionData.predictions_amount = action.payload
    },
    setForecasts: (state, action) => {
      state.forecasts = action.payload;
    },
    setForecsMeasure: (state,action) => {
      const m: Measure = {
        index: action.payload.index,
        value: action.payload.value
      }
      const f = state.forecasts.find(t=>t.forecast_id===action.payload.forecast_id);
      const meas = f!=undefined? f.measurements : undefined
      meas!=undefined && m.index!= undefined ? meas[action.payload.index] = m : null
    },
    setForecsInput: (state,action) => {
      const f = state.forecasts.find(t=>t.forecast_id===action.payload.forecast_id);
      if (f!=undefined){
        f.input = action.payload.input
      }
    },
    setForecsMeasureLen: (state, action) =>{
      const f = state.forecasts.find(t=>t.forecast_id===action.payload.forecast_id);
      const meas = f!=undefined? f.measurements : undefined
      let prev_len = meas!=undefined? meas.length : 0
      prev_len = prev_len==0? 1 : prev_len //otherwise the cycle would start with i:=-1
      meas!=undefined? meas.length = Math.max(0,Math.min(action.payload.length, 99)) : null
      for (let step = prev_len-1; step < action.payload.length; step++) {
        let ms: Measure = {
          index: step,
          value: ""
        }
        if (meas!=undefined) meas[step] = ms
      }
    }
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
            state.error = null
            state.forecasts.map((item) => {
              if (item.measurements == undefined){
                  const n: Measure={
                    index: 0,
                    value: ""
                  }
                  item.measurements = Array.from(Array(n))
                  if (item.input==""){
                item.measurements.length = 5
                  const keys = Array.from(Array(5).keys())
                  keys.map((key)=>{
                    const it: Measure={
                      index: key,
                      value: ""
                    }
                    item.measurements==undefined? null : item.measurements[key] = it
                  })
                }
                else{
                  const vals = item.input.split(',')
                  item.measurements.length = vals.length
                  const keys = Array.from(Array(vals.length).keys())
                  keys.map((key)=>{
                    console.log(item.input, vals.length, key)
                    const it: Measure={
                      index: key,
                      value: vals[key]
                    }
                    item.measurements==undefined? null : item.measurements[key] = it
                  })
                }
              }
            })
        }
      })
      .addCase(addForecastToPrediction.fulfilled, (state, action) => {
        state.count = action.payload.forecasts.length
        state.error = null
      })
      .addCase(getPrediction.rejected, (state) => {
        logoutUserAsync();
        state.error = 'Ошибка при загрузке данных';
      })
      .addCase(deletePrediction.fulfilled, (state) => {
        state.prediction_id = NaN;
        state.count = NaN;
        state.forecasts = [];
        state.predictionData = {
          prediction_window: 0,
          predictions_amount: 0,
        };
        state.error = null
      })
      .addCase(deletePrediction.rejected, (state) => {
        state.error = 'Ошибка при удалении вакансии';
      })
      .addCase(updatePrediction.fulfilled, (state) => {
        state.error = null
      })
      .addCase(updatePrediction.rejected, (state) => {
        state.error = 'Ошибка при обновлении данных';
      })
      .addCase(formPrediction.fulfilled, (state)=>{ //new prediction is soon to appear
        state.prediction_id = NaN;
        state.count = NaN;
        state.forecasts = [];
        state.predictionData = {
          prediction_window: 0,
          predictions_amount: 0,
        };
        state.error = null
      })
  }
});

export const {setPredictionDraftID, setCount, setForecsMeasure ,setForecsMeasureLen, setAmount, setWindow, setError, setForecsInput, setForecasts} = predictionDraftSlice.actions;
export default predictionDraftSlice.reducer;