import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import {config,logoutUserAsync} from './userSlice'

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

export const deleteVacancyApplication = createAsyncThunk(
  'vacancyApplication/deleteVacancyApplication',
  async (appId: string) => {
    const response = await api.vacancyApplications.vacancyApplicationsDeleteVacancyApplicationDelete(appId);
    return response.data;
  }
);

export const updateVacancyApplication = createAsyncThunk(
  'vacancyApplication/updateVacancyApplication',
  async ({ appId, vacancyData }: { appId: string; vacancyData: VacancyData }) => {
    const vacancyDataToSend = {
      vacancy_name: vacancyData.vacancy_name ?? '', 
      vacancy_responsibilities: vacancyData.vacancy_responsibilities ?? '',
      vacancy_requirements: vacancyData.vacancy_requirements ?? ''
    };
    const response = await api.vacancyApplications.vacancyApplicationsUpdateVacancyUpdate(appId, vacancyDataToSend);
    return response.data;
  }
);

export const deleteCityFromVacancyApplication = createAsyncThunk(
  'cities/deleteCityFromVacancyApplication',
  async ({ appId, cityId }: { appId: number; cityId: number }) => {
    await api.citiesVacancyApplications.citiesVacancyApplicationsDeleteCityFromVacancyApplicationDelete(
      appId.toString(),
      cityId.toString()
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
      state.forecasts = {
          ...state.forecasts,
          ...action.payload,
      };
    },
    setForecsMeasure: (state,action) => {
      console.log(action.payload.index)
      const m: Measure = {
        index: action.payload.index,
        value: action.payload.value
      }
      const f = state.forecasts.find(t=>t.forecast_id===action.payload.forecast_id);
      const meas = f!=undefined? f.measurements : undefined
      meas!=undefined && m.index!= undefined ? meas[action.payload.index] = m : null
    },
    setForecsMeasureLen: (state, action) =>{
      const f = state.forecasts.find(t=>t.forecast_id===action.payload.forecast_id);
      const meas = f!=undefined? f.measurements : undefined
      let prev_len = meas!=undefined? meas.length : 0
      prev_len = prev_len==0? 1 : prev_len //otherwise the cycle would start with i:=-1
      meas!=undefined? meas.length = Math.min(action.payload.length, 99) : null
      for (let step = prev_len-1; step < action.payload.length; step++) {
        console.log("Walking east one step");
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
                  const keys = Array.from(Array(5).keys())
                  keys.map((key)=>{
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
      })
      .addCase(getPrediction.rejected, (state) => {
        logoutUserAsync();
        state.error = 'Ошибка при загрузке данных';
      })
      .addCase(deleteVacancyApplication.fulfilled, (state) => {
        state.app_id = NaN;
        state.count = NaN;
        state.cities = [];
        state.vacancyData = {
          vacancy_name: '',
          vacancy_responsibilities: '',
          vacancy_requirements: ''
        };
      })
      .addCase(deleteVacancyApplication.rejected, (state) => {
        state.error = 'Ошибка при удалении вакансии';
      })
      .addCase(updateVacancyApplication.fulfilled, (state, action) => {
        state.vacancyData = action.payload;
      })
      .addCase(updateVacancyApplication.rejected, (state) => {
        state.error = 'Ошибка при обновлении данных';
      })
  }
});

export const {setPredictionDraftID, setCount, setForecsMeasure ,setForecsMeasureLen, setAmount, setWindow, setError} = predictionDraftSlice.actions;
export default predictionDraftSlice.reducer;