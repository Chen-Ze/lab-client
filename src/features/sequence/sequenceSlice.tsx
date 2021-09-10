import { GridColumns } from "@mui/x-data-grid";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { CommanderState } from "../commander/commanderSlice";
import { Keithley2636State } from "../keithley-2636/keithley2636Slice";
import { PauseState } from "../pause/pauseSlice";
import { PlotState } from "../plot/plotSlice";
import { RandomNumberState } from "../random-number/randomNumberSlice";
import { SettingState } from "../setting/settingSlice";
import { SubsequenceState } from "../subsequence/subsequenceSlice";


export interface SequenceDocument {
    setting: SettingState,
    commander: CommanderState,
    keithley2636: Keithley2636State,
    pause: PauseState,
    subsequence: SubsequenceState,
    randomNumber: RandomNumberState,
    dataGrid: {
        columns: GridColumns,
    },
    plot: PlotState
}

type SequenceState = { };

const initialState: SequenceState = { };

const sequenceSlice = createSlice({
    name: "sequence",
    initialState,
    reducers: {
        sequenceImported: (state, action: PayloadAction<SequenceDocument>) => { }
    },
});

export const {
    sequenceImported
} = sequenceSlice.actions;

export default sequenceSlice.reducer;

export const selectSequenceState = (state: RootState) => ({
    setting: state.setting,
    commander: state.commander,
    keithley2636: state.keithley2636,
    pause: state.pause,
    subsequence: state.subsequence,
    randomNumber: state.randomNumber,
    dataGrid: {
        columns: state.dataGrid.columns
    },
    plot: state.plot
} as SequenceDocument);
    