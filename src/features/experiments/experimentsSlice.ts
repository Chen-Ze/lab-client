import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";


export type ExperimentsState = {
    availableExperimentIdList: Array<{id: string, status: string}>,
    currentExperimentId: string,
    experimentEndedDialogOpen: boolean,
};

const initialState: ExperimentsState = { 
    availableExperimentIdList: [],
    currentExperimentId: '',
    experimentEndedDialogOpen: false
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
        },
        experimentEndedDialogOpenSet: (state, action: PayloadAction<boolean>) => {
            state.experimentEndedDialogOpen = action.payload;
        },
    },
});


export const selectAvailableExperimentIdList = (state: RootState) =>
    state.experiments.availableExperimentIdList;

export const selectCurrentExperimentId = (state: RootState) =>
    state.experiments.currentExperimentId;

export const selectExperimentEndedDialogOpen = (state: RootState) =>
    state.experiments.experimentEndedDialogOpen;

export default experimentsSlice.reducer;

export const {
    availableExperimentIdListUpdated,
    currentExperimentIdSet,
    experimentEndedDialogOpenSet
} = experimentsSlice.actions;
