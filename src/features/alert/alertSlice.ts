import { createEntityAdapter, createSlice, EntityId, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { fetchAvailableAddresses } from "../setting/settingSlice";


type Serverity = 'error' | 'warning' | 'info' | 'success';

export interface AlertEntity {
    id: EntityId,
    message: string,
    severity: Serverity,
    time?: number,
    show: boolean,
};

const alertAdapter = createEntityAdapter<AlertEntity>({});

const initialState = alertAdapter.getInitialState();

export type AlertState = typeof initialState;

export interface AlertMessage {
    message: string
}

const alertSlice = createSlice({
    name: "alert",
    initialState,
    reducers: {
        alertHidden: (state, action: PayloadAction<EntityId>) => {
            const entity = state.entities[action.payload];
            if (entity) entity.show = false;
        },
        alertErrorAdded: {
            reducer: alertAdapter.addOne,
            prepare: (message: AlertMessage) => {
                return {
                    payload: {
                        id: nanoid(),
                        message: JSON.stringify(message.message),
                        severity: 'error' as Serverity,
                        time: Date.now(),
                        show: true
                    }
                }
            }
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
    alertHidden,
    alertErrorAdded
} = alertSlice.actions;

export default alertSlice.reducer;

const alertSelectors = alertAdapter.getSelectors((state: RootState) => state.alert);

export const {
    selectAll: selectAllAlerts
} = alertSelectors;
