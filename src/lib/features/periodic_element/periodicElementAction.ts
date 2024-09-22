import { AppDispatch } from "@/lib/store";
import {
    fetchPeriodicElementFailure,
    fetchPeriodicElementSuccess,
    deletePeriodicElement,
    putPeriodicElementField,
    PeriodicElement,
} from "@/lib/features/periodic_element/perdiodicElementSlice";

export const fetchPeriodicElements = () => {
    return async (dispatch: AppDispatch) => {
        try {
            const periodicElements : PeriodicElement[] = [
                {id: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
                {id: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
                {id: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
                {id: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
                {id: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
                {id: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
                {id: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
                {id: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
                {id: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
                {id: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
            ];
            dispatch(fetchPeriodicElementSuccess(periodicElements));
        } catch (error: unknown) {
            if (error instanceof Error) {
                dispatch(fetchPeriodicElementFailure(error.message));
            } else {
                dispatch(fetchPeriodicElementFailure("An unknown error occurred"));
            }
        }
    };
}
export const removePeriodicElement = (id: number) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(deletePeriodicElement(id));
        } catch (error) {
            console.error("Error removing user:", error);
        }
    };
}
export const editPeriodicElementField = ( id: number, field: keyof PeriodicElement, value: string ) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(putPeriodicElementField({id: id, field: field, value: value}));
        } catch (error) {
            console.error("Error editing user:", error);
        }
    };
};