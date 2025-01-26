import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModeState {
    header: string,
    mode: string,
}

const initialState: ModeState = {
    header: 'dark',
    mode: 'light',
};

const modeSlice = createSlice({
    name: 'mode',
    initialState,
    reducers: {
        setMode: (state, action: PayloadAction<string>) => {
            state.mode = action.payload;
        },
        setHeaderMode: (state, action: PayloadAction<string>) => {
            state.header = action.payload;
        },
    },
});

export const { setMode, setHeaderMode } = modeSlice.actions;
export default modeSlice.reducer;