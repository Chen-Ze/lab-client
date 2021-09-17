import { EntityId } from "@reduxjs/toolkit";
import { CommanderRecipe, DEFAULT_COMMANDER_RECIPE } from 'material-science-experiment-recipes/lib/commander-recipe';
import { WrappedRecipe } from "material-science-experiment-recipes/lib/recipe";
import { RootState } from "../../app/store";
import { selectCommanderSubsequenceId } from "../commander/commanderSlice";
import { selectKeithley2636ById } from "../keithley-2636/keithley2636Slice";
import { selectPauseById } from "../pause/pauseSlice";
import { selectRandomNumberById } from "../random-number/randomNumberSlice";
import { selectSubsequenceById } from "../subsequence/subsequenceSlice";
import { selectKeithley2400ById } from "../keithley-2400/keithley2400Slice";
import { selectSequenceState } from "../sequence/SequenceDocument";
import { selectAllInstruments } from "../instruments/instrumentsSlice";
import { selectPythonSimpleById } from "../python-simple/pythonSimpleSlice";


export const selectExperimentById = (state: RootState, id: EntityId) => {
    return (
        selectKeithley2636ById(state, id) ||
        selectPauseById(state, id) ||
        selectRandomNumberById(state, id) ||
        selectKeithley2400ById(state, id) ||
        selectPythonSimpleById(state, id)
    );
}

export const selectExperimentsByIds = (state: RootState, ids?: EntityId[]) => {
    return ids && ids.map((id) => selectExperimentById(state, id));
}

export function compileSubsequence(state: RootState, id?: EntityId): WrappedRecipe[] {
    if (!id) return [];
    let experiments = selectExperimentsByIds(state, selectSubsequenceById(state, id)?.experiments);
    if (!experiments) return [];
    return experiments.filter(Boolean).filter(experiment => experiment?.enabled).map((experiment) => ({
        id: experiment!.id,
        recipe: experiment!.recipe,
        subsequence: compileSubsequence(state, experiment!.subsequenceId)
    }));
}

export function compileCommander(state: RootState): WrappedRecipe {
    const commanderSubsequenceId = selectCommanderSubsequenceId(state);
    return {
        id: commanderSubsequenceId,
        recipe: {
            ...DEFAULT_COMMANDER_RECIPE,
            store: selectSequenceState(state),
            instruments: selectAllInstruments(state).map(({ name, address, prototype }) => ({
                name,
                address,
                model: String(prototype)
            }))
        } as CommanderRecipe,
        subsequence: compileSubsequence(state, commanderSubsequenceId)
    }
}
