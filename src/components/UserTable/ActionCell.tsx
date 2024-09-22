import React from "react";
import { Button, DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components";
import { Trash2, Star, MoreHorizontal } from "lucide-react";
import { Row } from "@tanstack/table-core";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {RootState} from "@/lib/store";
import {setRowPinning, setRowSelection} from "@/lib/features/table/tableSlice";

interface HasId {
    id: string | number;
}

interface ActionsCellProps<TData extends HasId> {
    row: Row<TData>;
    tableId: string
    removeRow: (id: string | number) => void;
}

export function ActionsCell<TData extends HasId>({row, removeRow, tableId}: ActionsCellProps<TData>) {

    const dispatch = useAppDispatch();
    const {
        rowPinning,
        rowSelection
    } = useAppSelector((state: RootState) => state.table[tableId]);

    const handleDelete = () => {
        const id = row.original.id;

        const newRowPinning = { ...rowPinning };
        if (newRowPinning.top) {
            newRowPinning.top = newRowPinning.top.filter(pinnedId => pinnedId !== row.id);
        }

        const newRowSelection = { ...rowSelection };
        delete newRowSelection[row.id];

        dispatch(setRowPinning({ tableId, rowPinning: newRowPinning }));
        dispatch(setRowSelection({ tableId, rowSelection: newRowSelection }));

        removeRow(id);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => row.getIsPinned() ? row.pin(false) : row.pin('top')}>
                    <Star className="mr-2 h-4 w-4" fill={row.getIsPinned() ? "none" : "gold"} />
                    {row.getIsPinned() ? "Unpin" : "Pin"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}