import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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
            const response = await fetch("/user/reg", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const error = await response.json();
                return rejectWithValue(error.message);
            }

            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message);
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