import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { CommanderState } from "../commander/commanderSlice";
import { Keithley2636State } from "../keithley-2636/keithley2636Slice";
import { PauseState } from "../pause/pauseSlice";
import { SettingState } from "../setting/settingSlice";
import { SubsequenceState } from "../subsequence/subsequenceSlice";


export interface SequenceDocument {
    setting: SettingState,
    commander: CommanderState,
    keithley2636: Keithley2636State,
    pause: PauseState,
    subsequence: SubsequenceState
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
} as SequenceDocument);
    