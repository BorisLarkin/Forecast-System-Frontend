import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
    name: string;
}

const initialState: FilterState = {
    name: '',
};

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setFilterName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
    },
});

export const { setFilterName } = filterSlice.actions;
export default filterSlice.reducer;