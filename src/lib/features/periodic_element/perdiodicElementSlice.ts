import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {User} from "@/lib/features/user/userSlice";

export interface PeriodicElement {
    id: number
    name: string
    weight: number
    symbol: string
}

interface PerdiodicElementState {
    periodicElements: PeriodicElement[];
    error: string | null;
    dataFetched: boolean;
}
const initialState: PerdiodicElementState = {
    periodicElements: [],
    error: null,
    dataFetched: false,
};

export const perdiodicElementSlice = createSlice({
    name: "perdiodicElements",
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
} = perdiodicElementSlice.actions
export default perdiodicElementSlice.reducer