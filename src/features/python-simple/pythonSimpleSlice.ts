import { Action, createEntityAdapter, createSlice, EntityId, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { defaultPythonSimpleRecipe, PythonSimpleRecipe } from "material-science-experiment-recipes/lib/python-simple-recipe"
import { Recipe } from "material-science-experiment-recipes/lib/recipe";
import { Dispatch } from "react";
import { RootState } from "../../app/store";
import { sequenceImported } from "../sequence/sequenceSlice";
import { experimentAdded, ExperimentAddedPayload, ExperimentEntity, subsequenceAdded } from "../subsequence/subsequenceSlice";
import { handleVariableAction, VariablePayload } from "../util/variable";

export interface PythonSimpleEntity extends ExperimentEntity<PythonSimpleRecipe> {
    type: 'PythonSimple',
    subsequenceId: EntityId // remove this line if the new experiment has no children
}

export function isPythonSimpleEntity(entity: ExperimentEntity<Recipe>): entity is PythonSimpleEntity {
    return entity.type === 'PythonSimple';
}

export function defaultPythonSimpleEntity(subsequenceId?: EntityId, id?: EntityId): PythonSimpleEntity {
    if (!id) id = nanoid();
    if (!subsequenceId) subsequenceId = nanoid();
    return {
        type: 'PythonSimple',
        id,
        enabled: true,
        measuring: false,
        recipe: defaultPythonSimpleRecipe(),
        subsequenceId
    };
}

const pythonSimpleAdapter = createEntityAdapter<PythonSimpleEntity>();

const initialState = pythonSimpleAdapter.getInitialState();

export type PythonSimpleState = typeof initialState;

interface PythonSimpleUpdatedPayload {
    id: EntityId,
    name: string,
    value: any
}

interface PythonSimpleParameterUpdatedPayload {
    id: EntityId,
    name: string,
    value: any
}

const pythonSimpleSlice = createSlice({
    name: "pythonSimple",
    initialState,
    reducers: {
        pythonSimpleParameterUpdated: (state, action: PayloadAction<PythonSimpleParameterUpdatedPayload>) => {
            const {id, name, value} = action.payload;
            const entity = state.entities[id];
            if (!entity) return;
            entity.recipe = {
                ...entity.recipe,
                [name]: value
            };
        },
        pythonSimpleUpdated: (state, action: PayloadAction<PythonSimpleUpdatedPayload>) => {
            const {id, name, value} = action.payload;
            pythonSimpleAdapter.updateOne(state, {
                id,
                changes: {
                    [name]: value
                }
            });
        },
        pythonSimpleVariableChanged: (state, action: PayloadAction<VariablePayload>) => {
            handleVariableAction(state.entities[action.payload.id]?.recipe, action);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(experimentAdded, (state, { payload: { experimentEntity } }) => {
            if (isPythonSimpleEntity(experimentEntity)) {
                pythonSimpleAdapter.addOne(state, experimentEntity);
            }
        }).addCase(sequenceImported, (state, {payload}) => {
            return payload.pythonSimple || state; // pythonSimple not exported from old version
        });
    }
});

interface PythonSimpleAddedPayload extends ExperimentAddedPayload<PythonSimpleRecipe> {
    experimentEntity: PythonSimpleEntity
}

export const pythonSimpleAddedCreator = (payload: PythonSimpleAddedPayload) => (dispatch: Dispatch<Action<any>>) => {
    // remove the first dispatch if the new experiment has no chilren
    dispatch(subsequenceAdded({
        id: payload.experimentEntity.subsequenceId,
        experiments: []
    }));
    dispatch(experimentAdded({
        subsequenceId: payload.subsequenceId, // remove the subsequenceId entry if the new experiment has no chilren
        experimentEntity: payload.experimentEntity
    }));
}

export const {
    pythonSimpleParameterUpdated,
    pythonSimpleUpdated,
    pythonSimpleVariableChanged
} = pythonSimpleSlice.actions;

export default pythonSimpleSlice.reducer;

const pythonSimpleSelectors = pythonSimpleAdapter.getSelectors((state: RootState) => state.pythonSimple);
export const {
    selectById: selectPythonSimpleById,
} = pythonSimpleSelectors;