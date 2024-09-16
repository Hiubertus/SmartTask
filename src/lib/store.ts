import { configureStore } from '@reduxjs/toolkit';
import userReducer from "@/lib/features/user/userSlice";
import tableReducer from "@/lib/features/table/tableSlice"

export const makeStore = () => {
    return configureStore({
        reducer: {
            users: userReducer,
            table: tableReducer,
        }
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];