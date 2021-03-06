import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import commanderReducer from '../features/commander/commanderSlice';
import keithley2636Reducer from '../features/keithley-2636/keithley2636Slice';
import pauseReducer from '../features/pause/pauseSlice';
import randomNumberReducer from '../features/random-number/randomNumberSlice';
import subsequenceReducer from '../features/subsequence/subsequenceSlice';
import settingReducer from '../features/setting/settingSlice';
import monitorReducer from '../features/monitor/monitorSlice';
import dockReducer from '../features/dock/dockSlice';
import dataGridReducer from '../features/data/dataGridSlice';
import sequenceReducer from '../features/sequence/sequenceSlice';
import alertReducer from '../features/alert/alertSlice';
import experimentsReducer from '../features/experiments/experimentsSlice';
import plotReducer from '../features/plot/plotSlice';
import instrumentsReducer from '../features/instruments/instrumentsSlice';
import keithley2400Reducer from '../features/keithley-2400/keithley2400Slice';
import pythonSimpleReducer from '../features/python-simple/pythonSimpleSlice';
import lightFieldReducer from '../features/light-field/lightFieldSlice';


export const store = configureStore({
    reducer: {
        commander: commanderReducer,
        keithley2636: keithley2636Reducer,
        pause: pauseReducer,
        subsequence: subsequenceReducer,
        setting: settingReducer,
        monitor: monitorReducer,
        dock: dockReducer,
        dataGrid: dataGridReducer,
        sequence: sequenceReducer,
        alert: alertReducer,
        randomNumber: randomNumberReducer,
        experiments: experimentsReducer,
        plot: plotReducer,
        instruments: instrumentsReducer,
        keithley2400: keithley2400Reducer,
        pythonSimple: pythonSimpleReducer,
        lightField: lightFieldReducer
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
