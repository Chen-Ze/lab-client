import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { sequenceImported } from "../sequence/sequenceSlice";
import axios from 'axios';


const DEFAULT_KEITHLEY_2636_ADDRESS = "GPIB0::26::INSTR";

export type SettingState = {
    availableAddresses: string[],
    keithley2636Address: string
};

const initialState: SettingState = {
    availableAddresses: [],
    keithley2636Address: ''
};

export const fetchAvailableAddresses =
    createAsyncThunk<string[], void, { rejectValue: number }>(
        'setting/fetchAvailableAddresses',
        async (_, { rejectWithValue }) => {
            try {
                const responseJson = (await axios.get('/server/available-addresses')).data;
                return responseJson.availableAddresses as string[];
            } catch (e) {
                return rejectWithValue(Date.now());
            }
        }
    );

const settingSlice = createSlice({
    name: "setting",
    initialState,
    reducers: {
        keithley2636AddressSet: (state, action: PayloadAction<string>) => {
            state.keithley2636Address = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(sequenceImported, (state, { payload }) => {
            return payload.setting;
        }).addCase(fetchAvailableAddresses.fulfilled, (state, { payload }) => {
            const availableAddresses = payload;
            state.availableAddresses = availableAddresses;
            if ((availableAddresses.indexOf(DEFAULT_KEITHLEY_2636_ADDRESS) >= 0) && !state.keithley2636Address) {
                state.keithley2636Address = DEFAULT_KEITHLEY_2636_ADDRESS;
            }
        });
    }
});

export const {
    keithley2636AddressSet
} = settingSlice.actions;

export const selectSetting = (state: RootState) =>
    state.setting;

export default settingSlice.reducer;
