import { configureStore } from '@reduxjs/toolkit';
import userReducer from "@/lib/features/user/userSlice";
import tableReducer from "@/lib/features/table/tableSlice"
import periodicElementReducer from "@/lib/features/periodic_element/perdiodicElementSlice"

export const makeStore = () => {
    return configureStore({
        reducer: {
            users: userReducer,
            table: tableReducer,
            perdiodicElements: periodicElementReducer
        }
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];