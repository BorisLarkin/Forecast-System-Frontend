import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { DsPredictionWithUsers } from '../../api/Api';
import { api } from '../../api';
import {returnHeaderConfig} from './userSlice'


interface PredictionsFilterState {
    status: string ;
    startDate: string ;
    endDate: string ;
    username: string ;

    predictions_users?: DsPredictionWithUsers[] | null;
}

const initialState: PredictionsFilterState = {
    status: '',
    startDate: '',
    endDate: '',
    username: '',
    predictions_users: null
};

export const getPredictions = createAsyncThunk(
    'PredictionsFilter/getPredictions',
    async ({ status, start_date, end_date }: { status: string; start_date: string, end_date: string }, { rejectWithValue }) => {
        try{
            const response = await api.predictions.predictionsList({status: status, start_date: start_date, end_date: end_date}, returnHeaderConfig())
            return response.data;

        } catch(error){
            return rejectWithValue('Ошибка при загрузке данных');
        }
    }
  );

const PredictionsFilterSlice = createSlice({
    name: 'PredictionsFilter',
    initialState,
    reducers: {
        setStatus(state, action: PayloadAction<string>) {
            state.status = action.payload;
        },
        setStartDate(state, action: PayloadAction<string>) {
            state.startDate = action.payload;
        },
        setEndDate(state, action: PayloadAction<string>) {
            state.endDate = action.payload;
        },
        setUsername(state, action: PayloadAction<string>) {
            state.username = action.payload;
        },
        setPredictionsUsers(state, action: PayloadAction<[]>){
            state.predictions_users = action.payload
        },
        resetFilters(state) {
            state.status = '';
            state.startDate = '';
            state.endDate = '';
            state.username = '';
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase(getPredictions.fulfilled, (state,action) => {
            state.predictions_users = action.payload;
            if (state.username!='') {
                console.log('checked',state.username)
                state.predictions_users = state.predictions_users.filter((pr) =>  pr.username.toLowerCase().includes(state.username.toLowerCase()))
            }
          })
    }
});

export const { setStatus, setStartDate, setEndDate, resetFilters, setUsername } = PredictionsFilterSlice.actions;
export default PredictionsFilterSlice.reducer;