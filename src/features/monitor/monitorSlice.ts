import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { lastElement, sleep } from "../util/util";


const FETCH_DELAY = 500;

interface TimeStampNumber {
    time: number,
    value: number
};

type MonitorState = {
    smuAVoltages: TimeStampNumber[],
    smuACurrents: TimeStampNumber[],
    smuBVoltages: TimeStampNumber[],
    smuBCurrents: TimeStampNumber[]
};

const initialState: MonitorState = {
    smuAVoltages: [],
    smuACurrents: [],
    smuBVoltages: [],
    smuBCurrents: []
};

export const fetchKeithley2636 = createAsyncThunk('monitor/fetchSMUAVoltage', async () => {
    const smuAVoltageResponse = await (await fetch('http://localhost:8888/controller?function=query&name=Keithley2636&command=print')).json();
    const smuAVoltageTime = Date.now();
    await sleep(FETCH_DELAY);
    const smuACurrentResponse = await (await fetch('http://localhost:8888/controller?function=query&name=Keithley2636&command=print')).json();
    const smuACurrentTime = Date.now();
    await sleep(FETCH_DELAY);
    const smuBVoltageResponse = await (await fetch('http://localhost:8888/controller?function=query&name=Keithley2636&command=print')).json();
    const smuBVoltageTime = Date.now();
    await sleep(FETCH_DELAY);
    const smuBCurrentResponse = await (await fetch('http://localhost:8888/controller?function=query&name=Keithley2636&command=print')).json();
    const smuBCurrentTime = Date.now();
    await sleep(FETCH_DELAY);
    return {
        smuAVoltage: {
            time: smuAVoltageTime,
            value: Number(smuAVoltageResponse.read)
        },
        smuACurrent: {
            time: smuACurrentTime,
            value: Number(smuACurrentResponse.read)
        },
        smuBVoltage: {
            time: smuBVoltageTime,
            value: Number(smuBVoltageResponse.read)
        },
        smuBCurrent: {
            time: smuBCurrentTime,
            value: Number(smuBCurrentResponse.read)
        },
    };
});

const monitorSlice = createSlice({
    name: "monitor",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(fetchKeithley2636.fulfilled, (state, { payload }) => {
            state.smuAVoltages.push(payload.smuAVoltage);
            state.smuACurrents.push(payload.smuACurrent);
            state.smuBVoltages.push(payload.smuBVoltage);
            state.smuBCurrents.push(payload.smuBCurrent);
        });
    }
});

export const selectSMUAVoltages = (state: RootState) =>
    state.monitor.smuAVoltages;

export const selectLastSMUAVoltage = (state: RootState) =>
    lastElement(state.monitor.smuAVoltages) || {time: NaN, value: NaN};

export const selectSMUACurrents = (state: RootState) =>
    state.monitor.smuACurrents;

export const selectLastSMUACurrent = (state: RootState) =>
    lastElement(state.monitor.smuACurrents) || {time: NaN, value: NaN};

export const selectSMUBVoltages = (state: RootState) =>
    state.monitor.smuBVoltages;

export const selectLastSMUBVoltage = (state: RootState) =>
    lastElement(state.monitor.smuBVoltages) || {time: NaN, value: NaN};

export const selectSMUBCurrents = (state: RootState) =>
    state.monitor.smuBCurrents;

export const selectLastSMUBCurrent = (state: RootState) =>
    lastElement(state.monitor.smuBCurrents) || {time: NaN, value: NaN};

export type MonitorDataSelector = typeof selectSMUAVoltages;

export type MonitorLastSelector = typeof selectLastSMUAVoltage;

export default monitorSlice.reducer;
