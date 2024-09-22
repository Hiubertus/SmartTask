import { AppDispatch } from "@/lib/store";
import {
    fetchUsersSuccess,
    fetchUsersFailure,
    deleteUser,
    User,
    putUserField
} from "@/lib/features/user/userSlice";

export const fetchUsers = () => {
    return async (dispatch: AppDispatch) => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            const users = await response.json();
            dispatch(fetchUsersSuccess(users));
        } catch (error: unknown) {
            if (error instanceof Error) {
                dispatch(fetchUsersFailure(error.message));
            } else {
                dispatch(fetchUsersFailure("An unknown error occurred"));
            }
        }
    };
};

export const removeUser = (id: number) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(deleteUser(id));
        } catch (error) {
            console.error("Error removing user:", error);
        }
    };
};
export const editUserField = ( id: number, field: keyof User, value: string ) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(putUserField({id: id, field: field, value: value}));
        } catch (error) {
            console.error("Error editing user:", error);
        }
    };
};