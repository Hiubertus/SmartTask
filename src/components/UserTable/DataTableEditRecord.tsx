import React, { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    Button,
    Input
} from '@/components/ui';
import { Row } from '@tanstack/react-table';

interface HasId {
    id: string | number;
}

interface DataTableEditRecordProps<T> {
    row: Row<T>;
    editField: (id: string | number, field: keyof T, value: string) => void;
    field: keyof T;
}

export function DataTableEditRecord<T>({ row, editField, field }: DataTableEditRecordProps<T>) {
    const [editedValue, setEditedValue] = useState(String(row.original[field]));

    const handleSave = () => {
        editField((row.original as HasId).id, field, editedValue);
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-full justify-start text-left font-medium text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                >
                    {String(row.original[field])}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md mx-auto">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                        Edit {String(field)}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                        Make changes to the {String(field)} field below.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="mb-4">
                    <Input
                        type="text"
                        value={editedValue}
                        onChange={(e) => setEditedValue(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        className="h-8 px-4 flex items-center justify-center bg-transparent border border-red-300 rounded-md text-red-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleSave}
                        className="h-8 px-4 flex items-center justify-center bg-transparent border border-green-600 text-green-600 rounded-md hover:bg-indigo-100 transition-colors duration-200"
                    >
                        Save changes
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

