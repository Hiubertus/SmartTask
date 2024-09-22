import { AppDispatch } from "@/lib/store";
import {
    fetchUsers,
    deleteUser,
    User,
    editUser,
    setLoading
} from "@/lib/features/user/userSlice";

export const getUsers = () => {
    return async (dispatch: AppDispatch) => {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const users = await response.json();
        dispatch(fetchUsers(users));
    };
};
export const removeUser = (id: number) => {
    return async (dispatch: AppDispatch) => {
        dispatch(deleteUser(id));
    };
};
export const editUserField = ( id: number, field: keyof User, value: string ) => {
    return async (dispatch: AppDispatch) => {
        dispatch(editUser({id: id, field: field, value: value}));
    };
};
export const setLoadingUser = (check: boolean) => {
    return async (dispatch: AppDispatch) => {
        dispatch(setLoading(check))
    }
}