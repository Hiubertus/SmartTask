import {ColumnDef, Row} from "@tanstack/table-core";
import { Checkbox } from "@/components";
import { DataTableColumnHeader } from "@/components/UserTable/ColumnHeader";
import { ActionsCell } from "@/components/UserTable/ActionCell";
import { Column } from "@tanstack/react-table";
import {DataTableEditRecord} from "@/components/UserTable/DataTableEditRecord";


interface HasId {
    id: string | number;
}

export function generateColumns<T extends HasId>(
    keys: (keyof T)[],
    removeRow: (id: string | number) => void,
    editField: (id: string | number, field: keyof T, value: string) => void,
    setLoading: (isLoading: boolean) => void,
    tableId: string
): ColumnDef<T>[] {
    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Zaznacz wszystko"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Zaznacz wiersz"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        ...keys.map((key) => ({
            accessorKey: key,
            header: ({ column }: { column: Column<T> }) => (
                <DataTableColumnHeader
                    column={column}
                    setLoading={setLoading}
                    title={typeof key === 'string' ? key.charAt(0).toUpperCase() + key.slice(1) : String(key)}
                />
            ),
            cell: ({ row }: { row: Row<T> }) => (
                key === 'id' ? (
                    <span>{String(row.original[key])}</span>
                ) : (
                    <DataTableEditRecord
                        row={row}
                        editField={editField}
                        field={key}
                    />
                )
            ),
        })),
        {
            id: "actions",
            cell: ({ row }) => <ActionsCell row={row} removeRow={removeRow} tableId={tableId} />,
        },
    ];
}