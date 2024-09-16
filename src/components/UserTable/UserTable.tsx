"use client"
import React, {useEffect} from 'react';
import {fetchUsers} from "@/lib/features/user/userAction";
import {RootState} from "@/lib/store";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";

import {columns} from "@/components/UserTable/Columns";
import {DataTable} from "@/components/UserTable/DataTable";
import {setDataFlag} from "@/lib/features/user/userSlice";


export const UserTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const users = useAppSelector((state: RootState) => state.users.users);
    const error = useAppSelector((state: RootState) => state.users.error);
    const dataFetched = useAppSelector((state: RootState) => state.users.dataFetched);

    useEffect(() => {
        if (!dataFetched) {
            dispatch(fetchUsers())
            dispatch(setDataFlag(true))
        }
    }, [dispatch, dataFetched]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="w-full overflow-hidden">
            <div className="container mx-auto py-10 px-4 sm:px-8 lg:px-8">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                            <DataTable columns={columns} data={users}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}