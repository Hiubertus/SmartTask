"use client"
import React, {useCallback, useEffect} from 'react';
import {editUserField, fetchUsers, removeUser} from "@/lib/features/user/userAction";
import {RootState} from "@/lib/store";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {DataTable} from "@/components/UserTable/DataTable";
import { User } from "@/lib/features/user/userSlice";
import {generateColumns} from "@/components/UserTable/Columns";


export const UserTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const users = useAppSelector((state: RootState) => state.users.users);
    const error = useAppSelector((state: RootState) => state.users.error);
    const dataFetched = useAppSelector((state: RootState) => state.users.dataFetched);

    const removeRow = useCallback((id: string | number) => {
        if (typeof id === "number") {
            dispatch(removeUser(id));
        }
    }, [dispatch]);

    const refreshData = useCallback(() => {
        dispatch(fetchUsers())
    }, [dispatch])

    const editField = useCallback((id: string | number, field: keyof User, value: string) => {
        if (typeof id === "number") {
            dispatch(editUserField(id, field, value));
        }
    }, [dispatch]);

    useEffect(() => {
        if (!dataFetched) {
            dispatch(fetchUsers())
        }
    }, [dispatch, dataFetched]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    const columns = generateColumns<User>(
        ["id", "name", "email", "username", "phone"],
        removeRow,
        editField,
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
                                refreshData={refreshData}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}