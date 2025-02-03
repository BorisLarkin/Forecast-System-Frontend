import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';

interface UserState {
  uid?: number | null;
  login: string;
  role: number;
  token: string | null;
  error?: string | null;
}

const tokenFromStorage = localStorage.getItem('token');

export const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }
}

const initialState: UserState = {
  uid: tokenFromStorage ? decodeJwt(tokenFromStorage)?.Uid || null : null,
  login: '',
  token: tokenFromStorage,
  role: tokenFromStorage ? decodeJwt(tokenFromStorage)?.Role || 0 : 0,
  error: null,
};

function decodeJwt(token: string): { Uid: number, Role: number } | null {
  try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
          Uid: payload.Uid,
          Role: payload.Role,
      };
  } catch (error) {
      return null;
  }
}

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
  reducers: {
  restoreSession: (state, action) => {
    state.role = decodeJwt(action.payload.token)?.Role || 0;
    state.token = action.payload.token;
    state.login = action.payload.username;
    state.uid = decodeJwt(action.payload.token)?.Uid || null;
  }},
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.token = action.payload.access_token;
        state.login = action.payload.login;
        state.role = action.payload.role;
        state.uid = decodeJwt(action.payload.access_token)?.Uid || null;
        state.error = null;
        localStorage.setItem('token', action.payload.access_token); // Сохраняем токен
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