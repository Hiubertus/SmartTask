"use client"

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
import {fetchUsers, removeUser} from "@/lib/features/user/userAction";
import {Row} from "@tanstack/table-core";
import {User} from "@/lib/features/user/userSlice";
import {
    initialState,
    setPagination,
    setRowPinning,
    setRowSelection,
    setTableState,
    setSelectedColumn,
    setColumnFilters,
    setGlobalFilter
} from "@/lib/features/table/tableSlice";
import {RootState} from "@/lib/store";

interface DataTableControlsProps<TData> {
    table: Table<TData>
}

export function DataTableControls<TData>({table}: DataTableControlsProps<TData>) {
    const dispatch = useAppDispatch();
    const {
        pagination,
        rowPinning,
        selectedColumn, globalFilter
    } = useAppSelector((state: RootState) => state.table);
    const [filterValue, setFilterValue] = useState("");

    useEffect(() => {
        if (selectedColumn) {
            setFilterValue(table.getColumn(selectedColumn)?.getFilterValue() as string ?? "");
        } else {
            setFilterValue(globalFilter);
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
        dispatch(setPagination({ ...pagination, pageIndex: newPageIndex }));
    };

    const handleDeleteSelected = () => {
        selectedRows.forEach((row: Row<TData>) => {
            row.pin(false);
            dispatch(removeUser((row.original as User).id));
        });
        dispatch(setRowSelection({}))
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

        dispatch(setRowPinning(newPinning));
        dispatch(setRowSelection({}));
    };

    const handleReset = () => {
        dispatch(fetchUsers());
        dispatch(setTableState(initialState))
    };

    const handleColumnSelect = (value: string) => {
        if (value !== selectedColumn) {
            dispatch(setSelectedColumn(value))
            dispatch(setColumnFilters([]))
            dispatch(setGlobalFilter(""))
            table.resetGlobalFilter()
            setFilterValue("")
        }
    }

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setFilterValue(newValue);
        if (selectedColumn) {
            table.getColumn(selectedColumn)?.setFilterValue(newValue);
        } else {
            dispatch(setGlobalFilter(newValue));
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
                            .map((column) => (
                                <Input
                                    key={column.id}
                                    placeholder={`Filter ${column.id}...`}
                                    value={(column.getFilterValue() as string) ?? ""}
                                    onChange={(event) =>
                                        column.setFilterValue(event.target.value)
                                    }
                                    className="min-w-[150px] flex-grow"
                                />
                            ))}
                    </div>
                ) : (
                    <Input
                        placeholder={`Filter ${selectedColumn || "all columns"}...`}
                        value={filterValue}
                        onChange={handleFilterChange}
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