import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';

interface predictionDraftState {
  prediction_id?: number;
  count: number | undefined;
}

const initialState: predictionDraftState = {
    prediction_id: NaN,
    count: NaN,
};

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
});

export const {setPredictionDraftID, setCount} = predictionDraftSlice.actions;
export default predictionDraftSlice.reducer;