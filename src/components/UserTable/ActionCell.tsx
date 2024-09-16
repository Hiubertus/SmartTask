import React from "react";
import { removeUser } from "@/lib/features/user/userAction";
import { Button, DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components";
import {Trash2, Star, MoreHorizontal} from "lucide-react";
import { User } from "@/lib/features/user/userSlice"
import {useAppDispatch} from "@/lib/hooks";
import { Row } from "@tanstack/table-core";

interface ActionsCellProps {
    row: Row<User>;  // Typ row jako Row<User>
}

export const ActionsCell: React.FC<ActionsCellProps> = ({ row }) => {
    const dispatch = useAppDispatch();

    const handleDelete = () => {
        dispatch(removeUser(row.original.id));
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
                <DropdownMenuItem onClick={() => {
                    row.pin(false);
                    handleDelete();  // Wywołanie funkcji handleDelete
                }}>
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
};