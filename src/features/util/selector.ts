import { EntityId } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { selectKeithley2636ById } from "../keithley-2636/keithley2636Slice";
import { selectPauseById } from "../pause/pauseSlice";


export const selectExperimentById = (state: RootState, id: EntityId) => {
    return (
        selectKeithley2636ById(state, id) ||
        selectPauseById(state, id)
    );
}

export const selectExperimentsByIds = (state: RootState, ids?: EntityId[]) => {
    return ids && ids.map((id) => selectExperimentById(state, id));
}
