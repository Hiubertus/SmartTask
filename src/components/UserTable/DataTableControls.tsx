import React, {useCallback, useEffect, useState} from 'react'
import {DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu"
import {MixerHorizontalIcon} from "@radix-ui/react-icons"
import {Table} from "@tanstack/react-table"

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
import {CircleLoader} from "react-spinners";

interface HasId {
    id: string | number;
}

interface DataTableControlsProps<TData> {
    table: Table<TData>
    tableId: string
    removeRow: (id: string | number) => void;
    refreshData: () => void;
    setLoading: (isLoading: boolean) => void;
    isLoading: boolean;
}

export function DataTableControls<TData>({table, tableId, removeRow, refreshData, setLoading, isLoading}: DataTableControlsProps<TData>) {
    const dispatch = useAppDispatch();

    const {
        pagination,
        rowPinning,
        selectedColumn,
        globalFilter,
        columnFilters
    } = useAppSelector((state: RootState) => state.table[tableId]);
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [filterTimeout, setFilterTimeout] = useState<NodeJS.Timeout | null>(null);
    const [columnSelectTimeout, setColumnSelectTimeout] = useState<NodeJS.Timeout | null>(null);
    // const [isDebouncing, setIsDebouncing] = useState(false);

    useEffect(() => {
        if (selectedColumn && selectedColumn !== "each") {
            setFilterValues({
                [selectedColumn]: table.getColumn(selectedColumn)?.getFilterValue() as string ?? ""
            });
        } else if (selectedColumn === "each") {
            const newFilterValues: Record<string, string> = {};
            columnFilters.forEach(filter => {
                newFilterValues[filter.id] = filter.value as string;
            });
            setFilterValues(newFilterValues);
        } else {
            setFilterValues({ global: globalFilter ?? "" });
        }
    }, [selectedColumn, globalFilter, columnFilters, table]);

    const allColumns = table
        .getAllColumns()
        .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())

    const selectedRows = table.getSelectedRowModel().rows;

    const toggleAllColumns = (value: boolean) => {
        table.toggleAllColumnsVisible(value)
    }

    const handlePageChange = (newPageIndex: number) => {
        dispatch(setPagination({
            tableId: tableId,
            pagination: {pageIndex: newPageIndex, pageSize: pagination.pageSize}
        }));
    };

    const handleDeleteSelected = () => {
        const newPinning = {...rowPinning};
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

        dispatch(setRowPinning({tableId: tableId, rowPinning: newPinning}));
        dispatch(setRowSelection({tableId: tableId, rowSelection: {}}));

        handlePageChange(0);
    };

    const handlePinSelected = () => {
        const newPinning = {...rowPinning};
        const allRows = table.getRowModel().rows;

        selectedRows.forEach((row: Row<TData>) => {
            const rowIndex = allRows.findIndex(r => r.id === row.id);
            if (newPinning.top?.includes(rowIndex.toString())) {
                newPinning.top = newPinning.top.filter(id => id !== rowIndex.toString());
            } else {
                newPinning.top = [...(newPinning.top || []), rowIndex.toString()];
            }
        });

        dispatch(setRowPinning({tableId: tableId, rowPinning: newPinning}));
        dispatch(setRowSelection({tableId: tableId, rowSelection: {}}));
    };

    const handleReset = () => {
        refreshData();
        dispatch(resetTableState({tableId: tableId}))
    };

    const handleColumnSelect = (value: string) => {
        debounceColumnSelect(value);
    };
    const debounceColumnSelect = useCallback((value: string) => {
        if (columnSelectTimeout) {
            clearTimeout(columnSelectTimeout);
        }
        setLoading(true);
        const newTimeout = setTimeout(() => {
            if (value !== selectedColumn) {
                dispatch(setSelectedColumn({tableId: tableId, selectedColumn: value}));
                dispatch(setColumnFilters({tableId: tableId, columnFilters: []}));
                dispatch(setGlobalFilter({tableId: tableId, globalFilter: ""}));
                table.resetGlobalFilter();
                setFilterValues({});
            }
            setLoading(false);
        }, 1500);

        setColumnSelectTimeout(newTimeout);
    }, [columnSelectTimeout, setLoading, selectedColumn, dispatch, tableId, table]);

    const debounceFilterChange = useCallback((newValues: Record<string, string>) => {
        if (filterTimeout) {
            clearTimeout(filterTimeout);
        }
        setLoading(true);
        const newTimeout = setTimeout(() => {
            if (selectedColumn === "each") {
                const newColumnFilters = Object.entries(newValues).map(([id, value]) => ({ id, value }));
                dispatch(setColumnFilters({tableId: tableId, columnFilters: newColumnFilters}));
                newColumnFilters.forEach(({ id, value }) => {
                    table.getColumn(id)?.setFilterValue(value);
                });
            } else if (selectedColumn) {
                const newColumnFilters = [{ id: selectedColumn, value: newValues[selectedColumn] }];
                dispatch(setColumnFilters({tableId: tableId, columnFilters: newColumnFilters}));
                table.getColumn(selectedColumn)?.setFilterValue(newValues[selectedColumn]);
            } else {
                dispatch(setGlobalFilter({tableId: tableId, globalFilter: newValues.global}));
                table.setGlobalFilter(newValues.global);
            }
            setLoading(false);
        }, 1500);

        setFilterTimeout(newTimeout);
    }, [filterTimeout, setLoading, selectedColumn, dispatch, tableId, table]);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>, columnId?: string) => {
        const newValue = event.target.value;
        const newFilterValues = { ...filterValues, [columnId || 'global']: newValue };
        setFilterValues(newFilterValues);
        debounceFilterChange(newFilterValues);
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
                                    value={filterValues[column.id] || ""}
                                    onChange={(event) => handleFilterChange(event, column.id)}
                                    className="min-w-[150px] flex-grow"
                                />
                            ))}
                    </div>
                ) : (
                    <Input
                        placeholder={`Filter ${selectedColumn || "all columns"}...`}
                        value={filterValues[selectedColumn || 'global'] || ""}
                        onChange={(event) => handleFilterChange(event, selectedColumn || undefined)}
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

                <CircleLoader
                    color={"#000000"}
                    loading={isLoading}
                    size={30}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />

            </div>
        </div>
    )
}