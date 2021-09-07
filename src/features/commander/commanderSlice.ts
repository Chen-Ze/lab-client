import { createSlice, EntityId } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { sequenceImported } from "../sequence/sequenceSlice";
import { commanderSubsequenceAdded, selectSubsequenceById } from "../subsequence/subsequenceSlice";


export type CommanderState = { subsequenceId: EntityId };

const initialState: CommanderState = { 
    subsequenceId: "INIT_NOT_DONE"
};

const commanderSlice = createSlice({
    name: "commander",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(commanderSubsequenceAdded, (state, { payload }) => {
            state.subsequenceId = payload.id;
        }).addCase(sequenceImported, (state, {payload}) => {
            return payload.commander;
        });
    }
});


export const selectCommanderSubsequenceId = (state: RootState) =>
    state.commander.subsequenceId;

export const selectCommanderSubsequence = (state: RootState) =>
    selectSubsequenceById(state, state.commander.subsequenceId);

export default commanderSlice.reducer;
