"use client"
import React, {useCallback, useEffect} from 'react';
import {
    editPeriodicElementField,
    getPeriodicElements,
    removePeriodicElement, setLoadingPeriodicElement
} from "@/lib/features/periodic_element/periodicElementAction";
import {RootState} from "@/lib/store";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {DataTable} from "@/components/UserTable/DataTable";
import {generateColumns} from "@/components/UserTable/Columns";
import {PeriodicElement} from "@/lib/features/periodic_element/perdiodicElementSlice";
import {useErrorToast} from "@/components";


export const PeriodicElementsTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const periodicElements = useAppSelector((state: RootState) => state.periodicElements.data);
    const dataFetched = useAppSelector((state: RootState) => state.periodicElements.dataFetched);
    const isLoading = useAppSelector((state: RootState) => state.periodicElements.isLoading);

    const showErrorToast = useErrorToast();



    const removeRow = useCallback((id: string | number) => {
        if (typeof id === "number") {
            try {
                dispatch(removePeriodicElement(id));
            } catch (error: unknown) {
                showErrorToast(`Error while removing periodic element of id(${id}): ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    }, [dispatch, showErrorToast]);

    const editField = useCallback((id: string | number, field: keyof PeriodicElement, value: string) => {
        if (typeof id === "number") {
            try {
                dispatch(editPeriodicElementField(id, field, value));
            } catch (error: unknown) {
                showErrorToast(`Error while editing field "${field}" of periodic element ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    }, [dispatch, showErrorToast]);

    const setLoading = useCallback((isLoading: boolean) => {
        dispatch(setLoadingPeriodicElement(isLoading))
    }, [dispatch])

    useEffect(() => {
        if (!dataFetched) {
            try {
                dispatch(getPeriodicElements());
            } catch (error: unknown) {
                showErrorToast(`Error while fetching periodic elements: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    }, [dispatch, showErrorToast, dataFetched]);

    const refreshData = useCallback(() => {
        setLoading(true);
        setTimeout(() => {
            try {
                dispatch(getPeriodicElements());
            } catch (error: unknown) {
                showErrorToast(`Error while fetching periodic elements: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
                setLoading(false);
            }
        }, 1500);
    }, [dispatch, showErrorToast, setLoading]);



    const columns = generateColumns<PeriodicElement>(
        ["id", "name", "weight", "symbol"],
        removeRow,
        editField,
        setLoading,
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
                                refreshData={refreshData}
                                setLoading={setLoading}
                                isLoading={isLoading}
                                dataFetched={dataFetched}
                                />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}