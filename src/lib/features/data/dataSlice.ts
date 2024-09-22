import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Draft } from "immer";

export interface DataState<T> {
    data: T[];
    dataFetched: boolean;
    isLoading: boolean;
}

export const createDataSlice = <T extends { id: number | string }>({name, initialState}: {
    name: string;
    initialState: DataState<T>;
}) => {
    return createSlice({
        name,
        initialState,
        reducers: {
            setLoading: (state: Draft<DataState<T>>, action: PayloadAction<boolean>) => {
                state.isLoading = action.payload;
            },
            fetchData: (state: Draft<DataState<T>>, action: PayloadAction<T[]>) => {
                state.data = action.payload as Draft<T[]>;
                state.dataFetched = true;
            },
            deleteData: (state: Draft<DataState<T>>, action: PayloadAction<number | string>) => {
                state.data = state.data.filter((row) => row.id !== action.payload) as Draft<T[]>;
            },
            editData: (
                state: Draft<DataState<T>>,
                action: PayloadAction<{ id: number | string; field: keyof T; value: string }>
            ) => {
                const { id, field, value } = action.payload;
                const entityIndex = state.data.findIndex((record) => record.id === id);
                if (entityIndex !== -1) {
                    state.data[entityIndex] = {
                        ...state.data[entityIndex],
                        [field]: value,
                    } as Draft<T>;
                }
            },
        },
    });
};