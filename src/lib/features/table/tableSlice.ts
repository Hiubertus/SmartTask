import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    RowPinningState,
    PaginationState,
} from "@tanstack/react-table";

interface TableState {
    sorting: SortingState;
    columnFilters: ColumnFiltersState;
    globalFilter: string;
    columnVisibility: VisibilityState;
    rowSelection: Record<string, boolean>;
    rowPinning: RowPinningState;
    pagination: PaginationState;
    selectedColumn: string;
}

export const initialState: TableState = {
    sorting: [],
    columnFilters: [],
    globalFilter: "",
    columnVisibility: {},
    rowSelection: {},
    rowPinning: {
        top: [],
        bottom: [],
    },
    pagination: {
        pageIndex: 0,
        pageSize: 5,
    },
    selectedColumn: "",
};

const tableSlice = createSlice({
    name: "table",
    initialState,
    reducers: {
        setSorting: (state, action: PayloadAction<SortingState>) => {
            state.sorting = action.payload;
        },
        setColumnFilters: (state, action: PayloadAction<ColumnFiltersState>) => {
            state.columnFilters = action.payload;
        },
        setGlobalFilter: (state, action: PayloadAction<string>) => {
            state.globalFilter = action.payload;
        },
        setColumnVisibility: (state, action: PayloadAction<VisibilityState>) => {
            state.columnVisibility = action.payload;
        },
        setRowSelection: (state, action: PayloadAction<Record<string, boolean>>) => {
            state.rowSelection = action.payload;
        },
        setRowPinning: (state, action: PayloadAction<RowPinningState>) => {
            state.rowPinning = action.payload;
        },
        setPagination: (state, action: PayloadAction<PaginationState>) => {
            state.pagination = action.payload;
        },
        setSelectedColumn: (state, action: PayloadAction<string>) => {
            state.selectedColumn = action.payload;
        },
        setTableState: (state, action: PayloadAction<TableState>) => {
            return { ...state, ...action.payload };
        }
    },
});

export const {
    setSorting,
    setColumnFilters,
    setGlobalFilter,
    setColumnVisibility,
    setRowSelection,
    setRowPinning,
    setPagination,
    setSelectedColumn,
    setTableState
} = tableSlice.actions;

export default tableSlice.reducer;