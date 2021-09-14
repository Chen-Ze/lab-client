import { createAsyncThunk, createEntityAdapter, createSlice, EntityId, nanoid } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { sequenceImported } from "../sequence/sequenceSlice";
import { lastElement } from "../util/util";
import { fetchKeithley2400SMU, fetchKeithley2600SMUA, fetchKeithley2600SMUB, MonitorPrototype, MonitorResponse, TimeStampedValue } from "./Monitors";


interface MonitorEntity {
    id: EntityId,
    prototype: MonitorPrototype,
    title: string,
    responses: MonitorResponse[],
    delay: number,
    address: string
}

export function createMonitorEntity(prototype: MonitorPrototype, title: string, delay: number, address: string, id?: EntityId): MonitorEntity {
    if (!id) id = nanoid();
    return {
        id,
        prototype,
        title,
        delay,
        address,
        responses: []
    };
}

const monitorAdapter = createEntityAdapter<MonitorEntity>();

const initialState = monitorAdapter.getInitialState();

export type MonitorState = typeof initialState;

interface FetchMonitorParameters {
    monitorPrototype: MonitorPrototype,
    address: string,
    id: EntityId,
}

export const fetchMonitor = createAsyncThunk<MonitorResponse, FetchMonitorParameters>('monitor/fetchMonitor',
    async (parameters: FetchMonitorParameters) => {
        const {monitorPrototype, id, address} = parameters;
        switch (monitorPrototype) {
            case MonitorPrototype.Keithley2600SMUA:
                return await fetchKeithley2600SMUA(id, address);
            case MonitorPrototype.Keithley2600SMUB:
                return await fetchKeithley2600SMUB(id, address);
            case MonitorPrototype.Keithley2400SMU:
                return await fetchKeithley2400SMU(id, address);
        }
    }
);

const monitorSlice = createSlice({
    name: "monitor",
    initialState,
    reducers: {
        monitorAdded: monitorAdapter.addOne,
        monitorRemoved: monitorAdapter.removeOne
    },
    extraReducers: (builder) => {
        builder.addCase(sequenceImported, (state, {payload}) => {
            return payload.monitor;
        }).addCase(fetchMonitor.fulfilled, (state, { payload }) => {
            const { monitorId } = payload;
            const entity = state.entities[monitorId];
            if (!entity) return;
            entity.responses.push(payload);
        });
    }
});

const monitorSelectors = monitorAdapter.getSelectors((state: RootState) => state.monitor);
const {
    selectById,
    selectAll
} = monitorSelectors;

export const selectResponses = (state: RootState, id: EntityId) =>
    selectById(state, id)?.responses;

export const selectLastResponse = (state: RootState, id: EntityId) =>
    lastElement(selectResponses(state, id));

export const selectAllMonitorIdsTitlesAndPrototypes = (state: RootState) =>
    selectAll(state).map(({id, title, prototype}) => ({
        id,
        title,
        prototype
    }));

export default monitorSlice.reducer;

export const {
    monitorAdded,
    monitorRemoved
} = monitorSlice.actions;

export type TimeStampedValuesSelector<T> = (state: RootState) => TimeStampedValue<T>[];
export type TimeStampedValueSelector<T> = (state: RootState) => TimeStampedValue<T>;

export const selectMonitorSequenceExport = (state: RootState): MonitorState => ({
    ids: state.monitor.ids,
    entities: Object.fromEntries(Object.entries(state.monitor.entities).map(
        ([key, value]) => [key, {
            ...(value as MonitorEntity),
            responses: []
        }]
    ))
})
