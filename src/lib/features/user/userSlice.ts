import {createDataSlice, DataState} from "@/lib/features/data/dataSlice";

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
}

const initialUserState: DataState<User> = {
    data: [],
    dataFetched: false,
    isLoading: false
}

export const userSlice = createDataSlice<User>({
    name: 'users',
    initialState: initialUserState,
});
export const {
    fetchData: fetchUsers,
    deleteData: deleteUser,
    editData: editUser,
    setLoading: setLoading,
} = userSlice.actions;

export default userSlice.reducer;

