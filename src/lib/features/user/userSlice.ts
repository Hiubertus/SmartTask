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
        setDataFlag: (state, action: PayloadAction<boolean>) => {
            state.dataFetched = action.payload;
        },
    }
});

export const { fetchUsersSuccess, fetchUsersFailure, deleteUser, setDataFlag } = userSlice.actions;
export default userSlice.reducer;