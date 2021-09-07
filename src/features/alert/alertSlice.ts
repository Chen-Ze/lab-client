import { createEntityAdapter, createSlice, EntityId, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { fetchAvailableAddresses } from "../setting/settingSlice";


export interface AlertEntity {
    id: EntityId,
    message: string,
    severity: 'error' | 'warning' | 'info' | 'success',
    time?: number,
    show: boolean,
};

const alertAdapter = createEntityAdapter<AlertEntity>({});

const initialState = alertAdapter.getInitialState();

export type AlertState = typeof initialState;

const alertSlice = createSlice({
    name: "alert",
    initialState,
    reducers: {
        alertHidden: (state, action: PayloadAction<EntityId>) => {
            const entity = state.entities[action.payload];
            if (entity) entity.show = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAvailableAddresses.rejected, (state, action) => {
            alertAdapter.addOne(state, {
                id: action.meta.requestId,
                message: JSON.stringify(action.error),
                severity: 'error',
                time: action.payload,
                show: true
            });
        });
    }
});

export const {
    alertHidden
} = alertSlice.actions;

export default alertSlice.reducer;

const subsequenceSelectors = alertAdapter.getSelectors((state: RootState) => state.alert);

export const {
    selectAll: selectAllAlerts
} = subsequenceSelectors;
