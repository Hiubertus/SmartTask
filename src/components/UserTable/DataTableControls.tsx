
import React, {useEffect, useState} from 'react'
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { MixerHorizontalIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import {
    Button,
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    Input,
} from "@/components/ui"
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {Row} from "@tanstack/table-core";
import {
    setPagination,
    setRowPinning,
    setRowSelection,
    resetTableState,
    setSelectedColumn,
    setColumnFilters,
    setGlobalFilter
} from "@/lib/features/table/tableSlice";
import {RootState} from "@/lib/store";

interface HasId {
    id: string | number;
}
interface DataTableControlsProps<TData> {
    table: Table<TData>
    tableId: string
    removeRow: (id: string | number) => void;
    refreshData: () => void;
}

export function DataTableControls<TData>({table, tableId, removeRow, refreshData}: DataTableControlsProps<TData>) {
    const dispatch = useAppDispatch();
    const {
        pagination,
        rowPinning,
        selectedColumn,
        globalFilter,
        columnFilters
    } = useAppSelector((state: RootState) => state.table[tableId]);
    const [filterValue, setFilterValue] = useState("");

    useEffect(() => {
        if (selectedColumn && selectedColumn !== "each") {
            setFilterValue(table.getColumn(selectedColumn)?.getFilterValue() as string ?? "");
        } else {
            setFilterValue(globalFilter ?? "");
        }
    }, [selectedColumn, globalFilter, table]);

    const allColumns = table
        .getAllColumns()
        .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())

    const selectedRows = table.getSelectedRowModel().rows;

    const toggleAllColumns = (value: boolean) => {
        table.toggleAllColumnsVisible(value)
    }

    const handlePageChange = (newPageIndex: number) => {
        dispatch(setPagination({ tableId: tableId ,pagination: {pageIndex: newPageIndex, pageSize: pagination.pageSize }}));
    };

    const handleDeleteSelected = () => {
        const newPinning = { ...rowPinning };
        const allRows = table.getRowModel().rows;

        selectedRows.forEach((row: Row<TData>) => {
            const rowIndex = allRows.findIndex(r => r.id === row.id);
            if (rowIndex !== -1) {
                if (newPinning.top?.includes(rowIndex.toString())) {
                    newPinning.top = newPinning.top.filter(id => id !== rowIndex.toString());
                }

                removeRow((row.original as HasId).id);

                if (newPinning.top) {
                    newPinning.top = newPinning.top.map(id => {
                        const pinnedIndex = parseInt(id);
                        return pinnedIndex > rowIndex ? (pinnedIndex).toString() : id;
                    });
                }
            }
        });

        dispatch(setRowPinning({ tableId: tableId, rowPinning: newPinning }));
        dispatch(setRowSelection({ tableId: tableId, rowSelection: {} }));

        handlePageChange(0);
    };

    const handlePinSelected = () => {
        const newPinning = { ...rowPinning };
        const allRows = table.getRowModel().rows;

        selectedRows.forEach((row: Row<TData>) => {
            const rowIndex = allRows.findIndex(r => r.id === row.id);
            if (newPinning.top?.includes(rowIndex.toString())) {
                newPinning.top = newPinning.top.filter(id => id !== rowIndex.toString());
            } else {
                newPinning.top = [...(newPinning.top || []), rowIndex.toString()];
            }
        });

        dispatch(setRowPinning({ tableId: tableId,rowPinning: newPinning}));
        dispatch(setRowSelection({tableId: tableId, rowSelection: {}}));
    };

    const handleReset = () => {
        refreshData();
        dispatch(resetTableState({ tableId: tableId}))
    };

    const handleColumnSelect = (value: string) => {
        if (value !== selectedColumn) {
            dispatch(setSelectedColumn({tableId: tableId, selectedColumn: value}))
            dispatch(setColumnFilters({tableId: tableId, columnFilters: []}))
            dispatch(setGlobalFilter({tableId: tableId, globalFilter: ""}))
            table.resetGlobalFilter()
            setFilterValue("")
        }
    }

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>, columnId?: string) => {
        const newValue = event.target.value;
        if (columnId) {
            const newColumnFilters = [...columnFilters];
            const filterIndex = newColumnFilters.findIndex(filter => filter.id === columnId);
            if (filterIndex >= 0) {
                newColumnFilters[filterIndex] = { ...newColumnFilters[filterIndex], value: newValue };
            } else {
                newColumnFilters.push({ id: columnId, value: newValue });
            }
            dispatch(setColumnFilters({tableId: tableId, columnFilters: newColumnFilters}));
            table.getColumn(columnId)?.setFilterValue(newValue);
        } else {
            setFilterValue(newValue);
            dispatch(setGlobalFilter({tableId: tableId, globalFilter: newValue}));
            table.setGlobalFilter(newValue);
        }
    };

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2 w-full">
                {selectedColumn === "each" ? (
                    <div className="flex space-x-2 overflow-x-auto w-full">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanFilter())
                            .map((column) => {
                                const columnFilter = columnFilters.find(filter => filter.id === column.id);
                                return (
                                    <Input
                                        key={column.id}
                                        placeholder={`Filter ${column.id}...`}
                                        value={(columnFilter?.value as string) ?? ""}
                                        onChange={(event) => handleFilterChange(event, column.id)}
                                        className="min-w-[150px] flex-grow"
                                    />
                                );
                            })}
                    </div>
                ) : (
                    <Input
                        placeholder={`Filter ${selectedColumn || "all columns"}...`}
                        value={filterValue}
                        onChange={(event) => handleFilterChange(event)}
                        className="w-full"
                    />
                )}
            </div>
            <div className="flex flex-wrap items-center space-x-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                        >
                            <MixerHorizontalIcon className="mr-2 h-4 w-4"/>
                            Selection
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Selected</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={handleDeleteSelected}>
                            Delete Selected
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handlePinSelected}>
                            Pin Selected
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                        >
                            <MixerHorizontalIcon className="mr-2 h-4 w-4"/>
                            View
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[150px]">
                        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuCheckboxItem
                            checked={allColumns.every((column) => column.getIsVisible())}
                            onCheckedChange={(value) => toggleAllColumns(value)}
                        >
                            Select All
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuSeparator/>
                        {allColumns.map((column) => {
                            return (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(value)}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            )
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                        >
                            <MixerHorizontalIcon className="mr-2 h-4 w-4"/>
                            Filter Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuLabel>Filter Columns</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuRadioGroup value={selectedColumn} onValueChange={handleColumnSelect}>
                            <DropdownMenuRadioItem value="">
                                Filter All Columns
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="each">
                                Filter by Each Column
                            </DropdownMenuRadioItem>
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanFilter())
                                .map((column) => (
                                    <DropdownMenuRadioItem key={column.id} value={column.id}>
                                        {column.id}
                                    </DropdownMenuRadioItem>
                                ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 flex items-center"
                    onClick={handleReset}
                >
                    <MixerHorizontalIcon className="mr-2 h-4 w-4"/>
                    Reset Table
                </Button>
            </div>
        </div>
    )
}