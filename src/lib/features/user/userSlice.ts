import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
}

interface UserState {
    users: User[];
    error: string | null;
    dataFetched: boolean;
}

const initialState: UserState = {
    users: [],
    error: null,
    dataFetched: false,
};

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        fetchUsersSuccess: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload;
            state.error = null;
            state.dataFetched = true;
        },
        fetchUsersFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.users = [];
            state.dataFetched = false;
        },
        deleteUser: (state, action: PayloadAction<number>) => {
            const index = state.users.findIndex(user => user.id === action.payload);
            if (index !== -1) {
                state.users.splice(index, 1);
            }
        },
        putUserField: (state, action: PayloadAction<{ id: number, field: keyof User, value: string }>) => {
            const { id, field, value } = action.payload;
            const userIndex = state.users.findIndex(user => user.id === id);
            if (userIndex !== -1) {
                state.users[userIndex] = {
                    ...state.users[userIndex],
                    [field]: value
                };
            }
        },
    }
});

export const {
    fetchUsersSuccess,
    fetchUsersFailure,
    deleteUser,
    putUserField
} = userSlice.actions;
export default userSlice.reducer;