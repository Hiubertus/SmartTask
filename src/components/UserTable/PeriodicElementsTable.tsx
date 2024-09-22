"use client"
import React, {useCallback, useEffect} from 'react';
import {
    editPeriodicElementField,
    fetchPeriodicElements,
    removePeriodicElement
} from "@/lib/features/periodic_element/periodicElementAction";
import {RootState} from "@/lib/store";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {DataTable} from "@/components/UserTable/DataTable";
import {generateColumns} from "@/components/UserTable/Columns";
import {PeriodicElement} from "@/lib/features/periodic_element/perdiodicElementSlice";


export const PeriodicElementsTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const periodicElements = useAppSelector((state: RootState) => state.periodicElements.periodicElements);
    const error = useAppSelector((state: RootState) => state.periodicElements.error);
    const dataFetched = useAppSelector((state: RootState) => state.periodicElements.dataFetched);

    const removeRow = useCallback((id: string | number) => {
        if (typeof id === "number") {
            dispatch(removePeriodicElement(id));
        }
    }, [dispatch]);

    const refreshData = useCallback(() => {
        dispatch(fetchPeriodicElements())
    }, [dispatch])

    const editField = useCallback((id: string | number, field: keyof PeriodicElement, value: string) => {
        if (typeof id === "number") {
            dispatch(editPeriodicElementField(id, field, value));
        }
    }, [dispatch]);

    useEffect(() => {
        if (!dataFetched) {
            dispatch(fetchPeriodicElements())
        }
    }, [dispatch, dataFetched]);


    if (error) {
        return <div>Error: {error}</div>;
    }


    const columns = generateColumns<PeriodicElement>(
        ["id", "name", "weight", "symbol"],
        removeRow,
        editField,
        "2"
    );

    return (
        <div className="w-full overflow-hidden">
            <div className="container mx-auto py-10 px-4 sm:px-8 lg:px-8">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                            <DataTable
                                columns={columns}
                                data={periodicElements}
                                tableId={"2"}
                                removeRow={removeRow}
                                refreshData={refreshData}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}