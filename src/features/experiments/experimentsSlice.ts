import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";


export type ExperimentsState = {
    availableExperimentIdList: Array<{id: string, status: string}>,
    currentExperimentId: string
};

const initialState: ExperimentsState = { 
    availableExperimentIdList: [],
    currentExperimentId: ''
};

const experimentsSlice = createSlice({
    name: "experiments",
    initialState,
    reducers: {
        availableExperimentIdListUpdated: (state, action: PayloadAction<Array<{id: string, status: string}>>) => {
            state.availableExperimentIdList = action.payload;
        },
        currentExperimentIdSet: (state, action: PayloadAction<string>) => {
            state.currentExperimentId = action.payload;
        }
    },
});


export const selectAvailableExperimentIdList = (state: RootState) =>
    state.experiments.availableExperimentIdList;

export const selectCurrentExperimentId = (state: RootState) =>
    state.experiments.currentExperimentId;

export default experimentsSlice.reducer;

export const {
    availableExperimentIdListUpdated,
    currentExperimentIdSet
} = experimentsSlice.actions;
