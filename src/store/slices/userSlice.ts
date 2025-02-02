import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';

interface UserState {
  login: string;
  role: number;
  error?: string | null; 
}

const initialState: UserState = {
    login: '',
  role: 0, //guest
  error: null,
};

// Асинхронное действие для авторизации
export const loginUserAsync = createAsyncThunk(
  'user/loginUserAsync',
  async (credentials: { login: string; password: string; guest: boolean }, { rejectWithValue }) => {
    try {
      const response = await api.user.loginCreate(credentials);
      return response.data; 
    } catch (error) {
      return rejectWithValue('Ошибка авторизации'); // Возвращаем ошибку в случае неудачи
    }
  }
);

// Асинхронное действие для деавторизации
export const logoutUserAsync = createAsyncThunk(
  'user/logoutUserAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.user.logoutCreate();
      return response.data; 
    } catch (error) {
      return rejectWithValue('Ошибка при выходе из системы'); 
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        const { login } = action.payload;
        state.login = action.payload.login;
        state.role = action.payload.role;
        state.error = null;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
        state.role = 0; 
      })

      .addCase(logoutUserAsync.fulfilled, (state) => {
        state.login = '';
        state.role = 0;
        state.error = null;
      })
      .addCase(logoutUserAsync.rejected, (state, action) => {
        state.login = '';
        state.role = 0;
        state.error = null;
        state.error = action.payload as string;
      });      
  },
});

export const {} = userSlice.actions;
export default userSlice.reducer;