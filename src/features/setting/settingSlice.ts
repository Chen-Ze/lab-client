import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";


const DEFAULT_KEITHLEY_2636_ADDRESS = "GPIB0::26::INSTR";

type SettingState = {
    availableAddresses: string[],
    keithley2636Address: string
};

const initialState: SettingState = { 
    availableAddresses: [DEFAULT_KEITHLEY_2636_ADDRESS],
    keithley2636Address: DEFAULT_KEITHLEY_2636_ADDRESS
};

const commanderSlice = createSlice({
    name: "commander",
    initialState,
    reducers: {
        keithley2636AddressSet: (state, action: PayloadAction<string>) => {
            state.keithley2636Address = action.payload;
        }
    },
});

export const {
    keithley2636AddressSet
} = commanderSlice.actions;

export const selectSetting = (state: RootState) =>
    state.setting;

export default commanderSlice.reducer;
