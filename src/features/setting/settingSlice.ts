import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { RootState } from "../../app/store";
import { sequenceImported } from "../sequence/sequenceSlice";


export type SettingState = {
    availableAddresses: string[],
};

const initialState: SettingState = {
    availableAddresses: [],
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
    },
    extraReducers: (builder) => {
        builder.addCase(sequenceImported, (state, { payload }) => {
            return payload.setting;
        }).addCase(fetchAvailableAddresses.fulfilled, (state, { payload }) => {
            const availableAddresses = payload;
            state.availableAddresses = availableAddresses;
        });
    }
});

export const selectSetting = (state: RootState) =>
    state.setting;

export default settingSlice.reducer;
