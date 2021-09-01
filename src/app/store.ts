import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import commanderReducer from '../features/commander/commanderSlice';
import keithley2636Reducer from '../features/keithley-2636/keithley2636Slice';
import pauseReducer from '../features/pause/pauseSlice';
import subsequenceReducer from '../features/subsequence/subsequenceSlice';
import settingReducer from '../features/setting/settingSlice';
import monitorReducer from '../features/monitor/monitorSlice';


export const store = configureStore({
    reducer: {
        commander: commanderReducer,
        keithley2636: keithley2636Reducer,
        pause: pauseReducer,
        subsequence: subsequenceReducer,
        setting: settingReducer,
        monitor: monitorReducer
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
