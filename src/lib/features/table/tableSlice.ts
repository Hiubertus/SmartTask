import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    RowPinningState,
    PaginationState,
} from "@tanstack/react-table";

interface TablesState {
    [tableId: string]: TableState;
}

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

export const tableInitialState: TableState = {
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

const initialState: TablesState = {
    "1": tableInitialState,
    "2": tableInitialState,
};

const tableSlice = createSlice({
    name: "table",
    initialState,
    reducers: {
        setSorting: (state, action: PayloadAction<{ tableId: string; sorting: SortingState }>) => {
            const { tableId, sorting } = action.payload;
            state[tableId].sorting = sorting;
        },
        setColumnFilters: (state, action: PayloadAction<{ tableId: string; columnFilters: ColumnFiltersState }>) => {
            const { tableId, columnFilters } = action.payload;
            state[tableId].columnFilters = columnFilters;
        },
        setColumnVisibility: (state, action: PayloadAction<{tableId: string; columnVisibility: VisibilityState}>) => {
            const { tableId, columnVisibility } = action.payload;
            state[tableId].columnVisibility = columnVisibility;
        },
        setRowSelection: (state, action: PayloadAction<{tableId: string; rowSelection: Record<string, boolean>}>) => {
            const { tableId, rowSelection } = action.payload;
            state[tableId].rowSelection = rowSelection;
        },
        setRowPinning: (state, action: PayloadAction<{tableId: string; rowPinning: RowPinningState}>) => {
            const { tableId, rowPinning } = action.payload;
            state[tableId].rowPinning = rowPinning;
        },
        setGlobalFilter: (state, action: PayloadAction<{ tableId: string; globalFilter: string }>) => {
            const { tableId, globalFilter } = action.payload;
            state[tableId].globalFilter = globalFilter;
        },
        setPagination: (state, action: PayloadAction<{ tableId: string; pagination: PaginationState }>) => {
            const { tableId, pagination } = action.payload;
            state[tableId].pagination = pagination;
        },
        setSelectedColumn: (state, action: PayloadAction<{tableId: string; selectedColumn: string}>) => {
            const { tableId, selectedColumn } = action.payload;
            state[tableId].selectedColumn = selectedColumn;
        },
        resetTableState: (state, action: PayloadAction<{ tableId: string}>) => {
            const { tableId } = action.payload;
            state[tableId] = tableInitialState
        },
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
    resetTableState
} = tableSlice.actions;

export default tableSlice.reducer;