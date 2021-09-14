import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SequenceDocument } from "./SequenceDocument";


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
    