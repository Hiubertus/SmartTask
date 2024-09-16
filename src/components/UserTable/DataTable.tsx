"use client"

import {
    rankItem,
} from '@tanstack/match-sorter-utils'

import {
    ColumnDef,
    FilterFn,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Updater,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui"
import React from "react";
import {DataTablePagination} from "@/components/UserTable/DataTablePagination";
import {DataTableControls} from "@/components/UserTable/DataTableControls";
import {
    setSorting,
    setColumnFilters,
    setGlobalFilter,
    setColumnVisibility,
    setRowSelection,
    setRowPinning,
    setPagination
} from "@/lib/features/table/tableSlice";
import {RootState} from "@/lib/store";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({
        itemRank,
    })
    return itemRank.passed
}

declare module '@tanstack/react-table' {
    interface FilterFns {
        fuzzy: FilterFn<unknown>
    }
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                         }: DataTableProps<TData, TValue>) {

    const dispatch = useAppDispatch();
    const {
        sorting,
        columnFilters,
        globalFilter,
        columnVisibility,
        rowSelection,
        rowPinning,
        pagination,
    } = useAppSelector((state: RootState) => state.table);


    const handleUpdater = <T, >(value: Updater<T>, currentState: T): T => {
        return typeof value === "function" ? (value as (old: T) => T)(currentState) : value;
    };

    const table = useReactTable({
        data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: 'fuzzy',
        onSortingChange: (sortingUpdater) =>
            dispatch(setSorting(handleUpdater(sortingUpdater, sorting))),
        onColumnFiltersChange: (filtersUpdater) =>
            dispatch(setColumnFilters(handleUpdater(filtersUpdater, columnFilters))),
        onColumnVisibilityChange: (visibilityUpdater) =>
            dispatch(setColumnVisibility(handleUpdater(visibilityUpdater, columnVisibility))),
        onGlobalFilterChange: (filterUpdater) =>
            dispatch(setGlobalFilter(handleUpdater(filterUpdater, globalFilter))),
        onRowSelectionChange: (selectionUpdater) =>
            dispatch(setRowSelection(handleUpdater(selectionUpdater, rowSelection))),
        onRowPinningChange: (pinningUpdater) =>
            dispatch(setRowPinning(handleUpdater(pinningUpdater, rowPinning))),
        onPaginationChange: (paginationUpdater) => {
            dispatch(setPagination(handleUpdater(paginationUpdater, pagination)))
        },
        keepPinnedRows: true,
        autoResetPageIndex: false,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            globalFilter,
            rowSelection,
            rowPinning,
            pagination
        },
    })

    return (
        <div>
            <div className="flex items-center py-4">
                <DataTableControls table={table}/>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getTopRows().map((row) => (
                            <TableRow key={row.id} data-state={row.getIsPinned() && "pinned"} className={"bg-blue-200"}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows
                                .filter(row => !row.getIsPinned()) // Wyklucz przypięte wiersze
                                .map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className={"mt-4"}>
                <DataTablePagination table={table}/>
            </div>

        </div>
    )
}