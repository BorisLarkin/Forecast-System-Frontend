import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import { DsForecasts } from '../../api/Api';
import { Forecasts_Mock } from "../../modules/mock"; // мок-данные
import { setPredictionDraftID, setCount } from './predictionDraftSlice';

interface ForecastsState {
  searchValue: string;
  forecasts: DsForecasts[];
  loading: boolean;
  cartCount: number;
  predictionID: string;
}

const initialState: ForecastsState = {
  searchValue: '',
  forecasts: [],
  loading: false,
  cartCount: 0,
  predictionID: ''
};

export const getForecastsList = createAsyncThunk(
  'forecasts/getForecastsList',
  async (_, { getState, dispatch, rejectWithValue }) => {
    const { forecasts }: any = getState();
    try {
      const response = await api.forecasts.forecastsList({forecast_name: forecasts.searchValue});

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

const forecastsSlice = createSlice({
  name: 'forecasts',
  initialState,
  reducers: {
    setSearchValue(state, action) {
      state.searchValue = action.payload;
    },
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
        console.log("req fulfilled with", state.searchValue)
      })
      .addCase(getForecastsList.rejected, (state) => {
        state.loading = false;
        state.forecasts = Forecasts_Mock.filter((item) =>
          item.title.toLocaleLowerCase().includes(state.searchValue.toLocaleLowerCase())
        );
      });
  },
});

export const { setSearchValue } = forecastsSlice.actions;
export default forecastsSlice.reducer;