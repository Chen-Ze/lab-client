import { GridColumns } from "@mui/x-data-grid";
import { RootState } from "../../app/store";
import { CommanderState } from "../commander/commanderSlice";
import { InstrumentsState } from "../instruments/instrumentsSlice";
import { Keithley2400State } from "../keithley-2400/keithley2400Slice";
import { Keithley2636State } from "../keithley-2636/keithley2636Slice";
import { MonitorState, selectMonitorSequenceExport } from "../monitor/monitorSlice";
import { PauseState } from "../pause/pauseSlice";
import { PlotState } from "../plot/plotSlice";
import { RandomNumberState } from "../random-number/randomNumberSlice";
import { SettingState } from "../setting/settingSlice";
import { SubsequenceState } from "../subsequence/subsequenceSlice";


export interface SequenceDocument {
    setting: SettingState;
    commander: CommanderState;
    keithley2636: Keithley2636State;
    pause: PauseState;
    subsequence: SubsequenceState;
    randomNumber: RandomNumberState;
    dataGrid: {
        columns: GridColumns;
    };
    plot: PlotState;
    keithley2400: Keithley2400State;
    monitor: MonitorState;
    instruments: InstrumentsState;
}

export const selectSequenceState = (state: RootState): SequenceDocument => ({
    setting: state.setting,
    commander: state.commander,
    keithley2636: state.keithley2636,
    pause: state.pause,
    subsequence: state.subsequence,
    randomNumber: state.randomNumber,
    dataGrid: {
        columns: state.dataGrid.columns
    },
    plot: state.plot,
    keithley2400: state.keithley2400,
    monitor: selectMonitorSequenceExport(state),
    instruments: state.instruments
});