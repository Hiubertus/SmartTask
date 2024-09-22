import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface PeriodicElement {
    id: number
    name: string
    weight: number
    symbol: string
}

interface PeriodicElementState {
    periodicElements: PeriodicElement[];
    error: string | null;
    dataFetched: boolean;
}
const initialState: PeriodicElementState = {
    periodicElements: [],
    error: null,
    dataFetched: false,
};

export const periodicElementSlice = createSlice({
    name: "periodicElements",
    initialState: initialState,
    reducers: {
        fetchPeriodicElementSuccess: (state, action: PayloadAction<PeriodicElement[]>) => {
            state.periodicElements = action.payload;
            state.error = null;
            state.dataFetched = true;
        },
        fetchPeriodicElementFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.periodicElements = [];
            state.dataFetched = false;
        },
        deletePeriodicElement: (state, action: PayloadAction<number>) => {
            const index = state.periodicElements.findIndex(periodicElement => periodicElement.id === action.payload);
            if (index !== -1) {
                state.periodicElements.splice(index, 1);
            }
        },
        putPeriodicElementField: (state, action: PayloadAction<{ id: number, field: keyof PeriodicElement, value: string }>) => {
            const { id, field, value } = action.payload;
            const userIndex = state.periodicElements.findIndex(periodicElement => periodicElement.id === id);
            if (userIndex !== -1) {
                state.periodicElements[userIndex] = {
                    ...state.periodicElements[userIndex],
                    [field]: value
                };
            }
        },
    }
})
export const {
    fetchPeriodicElementSuccess,
    fetchPeriodicElementFailure,
    deletePeriodicElement,
    putPeriodicElementField
} = periodicElementSlice.actions
export default periodicElementSlice.reducer