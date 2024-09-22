import {createDataSlice, DataState} from "@/lib/features/data/dataSlice";

export interface PeriodicElement {
    id: number;
    name: string;
    weight: number;
    symbol: string;
}

const initialPeriodicElementState: DataState<PeriodicElement> = {
    data: [],
    dataFetched: false,
    isLoading: false,
};

export const periodicElementSlice = createDataSlice<PeriodicElement>({
    name: 'periodicElements',
    initialState: initialPeriodicElementState,
});

export const {
    fetchData: fetchPeriodicElements,
    deleteData: deletePeriodicElement,
    editData: editPeriodicElement,
    setLoading: setLoading,
} = periodicElementSlice.actions;

export default periodicElementSlice.reducer;