import { createEntityAdapter, createSlice, EntityId, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { sequenceImported } from "../sequence/sequenceSlice";


export enum InstrumentPrototype {
    Keithley2400 = "Keithley 2400",
    Keithley2600 = "Keithley 2600",
    Keithley4200 = "Keithley 4200",
    LakeShore336 = "Lake Shore 336",
    LakeShore625 = "Lake Shore 625",
    GPIB = "GPIB",
}

export interface InstrumentEntity {
    id: EntityId,
    prototype: InstrumentPrototype,
    address: string,
    name: string
};

export function defaultInstrumentEntity(id?: EntityId): InstrumentEntity {
    if (!id) id = nanoid();
    return {
        id,
        prototype: InstrumentPrototype.GPIB,
        address: '',
        name: ''
    };
}

const instrumentsAdapter = createEntityAdapter<InstrumentEntity>();

const initialState = instrumentsAdapter.getInitialState();

export type InstrumentsState = typeof initialState;

interface InstrumentPrototypeUpdatedPayload {
    id: EntityId,
    prototype: InstrumentPrototype
}

interface InstrumentAddressUpdatedPayload {
    id: EntityId,
    address: string
}

interface InstrumentNameUpdatedPayload {
    id: EntityId,
    name: string
}

const instrumentsSlice = createSlice({
    name: "instruments",
    initialState,
    reducers: {
        instrumentAdded: instrumentsAdapter.addOne,
        instrumentPrototypeUpdated: (state, action: PayloadAction<InstrumentPrototypeUpdatedPayload>) => {
            const {id, prototype} = action.payload;
            instrumentsAdapter.updateOne(state, {
                id,
                changes: {
                    prototype
                }
            })
        },
        instrumentAddressUpdated: (state, action: PayloadAction<InstrumentAddressUpdatedPayload>) => {
            const {id, address} = action.payload;
            instrumentsAdapter.updateOne(state, {
                id,
                changes: {
                    address
                }
            })
        },
        instrumentNameUpdated: (state, action: PayloadAction<InstrumentNameUpdatedPayload>) => {
            const {id, name} = action.payload;
            instrumentsAdapter.updateOne(state, {
                id,
                changes: {
                    name
                }
            })
        },
        instrumentRemoved: instrumentsAdapter.removeOne,
    },
    extraReducers: (builder) => {
        builder.addCase(sequenceImported, (state, {payload}) => {
            return payload.instruments
        });
    }
});

export const {
    instrumentAdded,
    instrumentAddressUpdated,
    instrumentNameUpdated,
    instrumentPrototypeUpdated,
    instrumentRemoved
} = instrumentsSlice.actions;

export default instrumentsSlice.reducer;

const instrumentsSelectors = instrumentsAdapter.getSelectors((state: RootState) => state.instruments);
export const {
    selectById: selectInstrumentById,
    selectAll: selectAllInstruments,
    selectIds: selectAllInstrumentIds
} = instrumentsSelectors;

export const selectInstrumentsByPrototype = (state: RootState, prototype: InstrumentPrototype) =>
    selectAllInstruments(state).filter(instrument => instrument.prototype === prototype);
