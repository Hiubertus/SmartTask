"use client"

import React, {useCallback, useEffect} from 'react';
import {editUserField, getUsers, removeUser, setLoadingUser} from "@/lib/features/user/userAction";
import {RootState} from "@/lib/store";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {DataTable} from "@/components/UserTable/DataTable";
import {User} from "@/lib/features/user/userSlice";
import {generateColumns} from "@/components/UserTable/Columns";
import {useErrorToast} from "@/components";


export const UserTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const users = useAppSelector((state: RootState) => state.users.data);
    const dataFetched = useAppSelector((state: RootState) => state.users.dataFetched);
    const isLoading = useAppSelector((state: RootState) => state.users.isLoading);

    const showErrorToast = useErrorToast();



    const removeRow = useCallback((id: string | number) => {
        if (typeof id === "number") {
            try {
                dispatch(removeUser(id));
            } catch (error: unknown) {
                showErrorToast(`Error while removing user with id(${id}): ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    }, [dispatch, showErrorToast]);

    const editField = useCallback((id: string | number, field: keyof User, value: string) => {
        if (typeof id === "number") {
            try {
                dispatch(editUserField(id, field, value));

            } catch (error: unknown) {
                showErrorToast(`Error while editing field "${field}" of user ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    }, [dispatch, showErrorToast]);

    const setLoading = useCallback((isLoading: boolean) => {
        dispatch(setLoadingUser(isLoading))
    }, [dispatch])

    useEffect(() => {
        if (!dataFetched) {
            try {
                dispatch(getUsers());
            } catch (error: unknown) {
                showErrorToast(`Error while fetching periodic elements: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    }, [dispatch, showErrorToast, dataFetched]);

    const refreshData = useCallback(() => {
        setLoading(true);

        setTimeout(() => {
            try {
                dispatch(getUsers());
            } catch (error: unknown) {
                showErrorToast(`Error while fetching users: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
                setLoading(false);
            }
        }, 1500);
    }, [dispatch, showErrorToast, setLoading]);

    const columns = generateColumns<User>(
        ["id", "name", "email", "username", "phone"],
        removeRow,
        editField,
        setLoading,
        "1"
    );

    return (
        <div className="w-full overflow-hidden">
            <div className="container mx-auto py-10 px-4 sm:px-8 lg:px-8">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                            <DataTable
                                columns={columns}
                                data={users}
                                tableId={"1"}
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