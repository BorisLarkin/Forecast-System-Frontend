import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import { DsForecasts, DsForecastResponse, DsForecastRequest } from '../../api/Api';
import { Forecasts_Mock } from "../../modules/mock"; // мок-данные
import { setPredictionDraftID, setCount } from './predictionDraftSlice';
import { logoutUserAsync } from './userSlice'
import {returnHeaderConfig} from './userSlice'

interface ForecastsState {
  forecast?: DsForecastResponse | null;
  forecast_id?: number | null;
  searchValue: string;
  forecasts: DsForecasts[];
  loading: boolean;
  cartCount: number;
  predictionID: string;
}

const empty_forecast: DsForecastResponse= {
  forecast_id: 1,
  color: '',
  descr: '',
  ext_desc: '',
  image: '',
  measure_type: '',
  short_title: '',
  title: ''
}

const initialState: ForecastsState = {
  searchValue: '',
  forecasts: [],
  loading: false,
  cartCount: 0,
  predictionID: '',
  forecast: empty_forecast,
  forecast_id: 0
};



export const getForecastsList = createAsyncThunk(
  'forecasts/getForecastsList',
  async (_, { getState, dispatch, rejectWithValue }) => {
    const { forecasts }: any = getState();
    try {
      const response = await api.forecasts.forecastsList({forecast_name: forecasts.searchValue}, returnHeaderConfig());

      const draft_id = response.data.prediction_id; // ID черновой заявки
      const count = response.data.prediction_size; // количество услуг в черновой заявке

      dispatch(setPredictionDraftID(draft_id));
      dispatch(setCount(count));

      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при загрузке данных');
    }
  }
);

export const getForecast = createAsyncThunk(
  'forecasts/getForecast',
  async (forecast_id: number, { dispatch, rejectWithValue }) => {
    try {
              dispatch(setForecastDetailId(forecast_id))
      const response = await api.forecast.forecastDetail(forecast_id, returnHeaderConfig());
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при загрузке данных');
    }
  }
);

export const editForecast = createAsyncThunk(
  'forecasts/editForecast',
  async ({forecast_id, forecast}:{forecast_id: number; forecast: DsForecastRequest}, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setForecastDetailId(forecast_id))
      const response = await api.forecast.editUpdate(forecast_id, forecast, returnHeaderConfig());
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при загрузке данных');
    }
  }
);

export const addPictureToForecast = createAsyncThunk(
  'forecasts/addPictureToForecast',
  async ({forecast_id, image}:{forecast_id: number; image: File}, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setForecastDetailId(forecast_id))
      const response = await api.forecast.addPictureCreate(forecast_id, {image}, returnHeaderConfig());
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при загрузке данных');
    }
  }
);

export const addForecast = createAsyncThunk(
  'forecasts/editForecast',
  async (forecast: DsForecastRequest, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.forecast.postForecast(forecast, returnHeaderConfig());
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при загрузке данных');
    }
  }
);

export const deleteForecast = createAsyncThunk(
  'forecasts/deleteForecast',
  async (forecast_id: number, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.forecast.deleteDelete(forecast_id, returnHeaderConfig());
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при загрузке данных');
    }
  }
);

const forecastsSlice = createSlice({
  name: 'forecasts',
  initialState,
  reducers: {
    setSearchValue(state, action) {
      state.searchValue = action.payload;
    },
    setForecastDetailId(state,action){
      console.log('reducer call', action.payload)
      state.forecast_id = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getForecastsList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getForecastsList.fulfilled, (state, action) => {
        state.loading = false;
        state.forecasts = action.payload.forecasts;
        state.cartCount = action.payload.prediction_size
        state.predictionID = action.payload.prediction_id
        if (action.payload.prediction_id =='none'){
          logoutUserAsync();
        }
      })
      .addCase(getForecastsList.rejected, (state) => {
        state.loading = false;
        state.forecasts = Forecasts_Mock.filter((item) =>
          item.title.toLocaleLowerCase().includes(state.searchValue.toLocaleLowerCase())
        );
      })
      .addCase(getForecast.pending, (state) => {
        state.loading = true;
      })
      .addCase(getForecast.fulfilled, (state,action) =>{
        state.loading=false
        let response : DsForecastResponse
        response = action.payload
        state.forecast = response
      })
      .addCase(getForecast.rejected, (state) => {
        state.loading = false;
        state.forecast = Forecasts_Mock.find(Forecast => Forecast?.forecast_id === state.forecast_id) as DsForecastResponse;
      })
      .addCase(addForecast.fulfilled, (state,action) => {
        state.forecast_id = action.payload.forecast_id;
      })
  },
});

export const { setSearchValue,setForecastDetailId } = forecastsSlice.actions;
export default forecastsSlice.reducer;