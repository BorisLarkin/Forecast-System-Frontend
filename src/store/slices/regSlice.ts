import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from '../../api';
import { returnHeaderConfig } from "./userSlice";
import { HandlerRegisterReq } from '../../api/Api';

interface RegState {
    isLoading: boolean;
    error: string | null;
}

const initialState: RegState = {
    isLoading: false,
    error: null,
};



// Async thunk для отправки данных на сервер
export const registerUser = createAsyncThunk(
    "user/registerUser",
    async (userData: { login: string; password: string; repeat_password: string }, { rejectWithValue }) => {
        try {
          let req : HandlerRegisterReq = {
            login: userData.login,
            password: userData.password
          }
          const response = await api.user.registerCreate(req, returnHeaderConfig())
          return response.data; 
        } catch (error) {
          return rejectWithValue('Ошибка авторизации'); // Возвращаем ошибку в случае неудачи
        }
      }
);

const regSlice = createSlice({
    name: "reg",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export default regSlice.reducer;