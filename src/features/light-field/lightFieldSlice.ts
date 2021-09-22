import { Action, createEntityAdapter, createSlice, EntityId, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { defaultLightFieldRecipe, LightFieldRecipe, LightFieldTask } from "material-science-experiment-recipes/lib/lightfield-recipe"
import { Recipe } from "material-science-experiment-recipes/lib/recipe";
import { Dispatch } from "react";
import { RootState } from "../../app/store";
import { sequenceImported } from "../sequence/sequenceSlice";
import { experimentAdded, ExperimentAddedPayload, ExperimentEntity, subsequenceAdded } from "../subsequence/subsequenceSlice";
import { handleVariableAction, VariablePayload } from "../util/variable";

export interface LightFieldEntity extends ExperimentEntity<LightFieldRecipe> {
    type: 'LightField',
    subsequenceId: EntityId // remove this line if the new experiment has no children
}

export function isLightFieldEntity(entity: ExperimentEntity<Recipe>): entity is LightFieldEntity {
    return entity.type === 'LightField';
}

export function defaultLightFieldEntity(subsequenceId?: EntityId, id?: EntityId): LightFieldEntity {
    if (!id) id = nanoid();
    if (!subsequenceId) subsequenceId = nanoid();
    return {
        type: 'LightField',
        id,
        enabled: true,
        measuring: false,
        recipe: defaultLightFieldRecipe(),
        subsequenceId
    };
}

const lightFieldAdapter = createEntityAdapter<LightFieldEntity>();

const initialState = lightFieldAdapter.getInitialState();

export type LightFieldState = typeof initialState;

interface LightFieldUpdatedPayload {
    id: EntityId,
    name: string,
    value: any
}

interface LightFieldTaskUpdatedPayload {
    id: EntityId,
    task: LightFieldTask
}

interface LightFieldParameterUpdatedPayload {
    id: EntityId,
    name: string,
    value: string
}

const lightFieldSlice = createSlice({
    name: "lightField",
    initialState,
    reducers: {
        lightFieldTaskUpdated: (state, action: PayloadAction<LightFieldTaskUpdatedPayload>) => {
            const {id, task} = action.payload;
            const entity = state.entities[id];
            if (!entity) return;
            entity.recipe.task = task;
            entity.recipe.payload = {};
        },
        lightFieldParameterUpdated: (state, action: PayloadAction<LightFieldParameterUpdatedPayload>) => {
            const {id, name, value} = action.payload;
            const entity = state.entities[id];
            if (!entity) return;
            entity.recipe.payload[name] = value;
        },
        lightFieldUpdated: (state, action: PayloadAction<LightFieldUpdatedPayload>) => {
            const {id, name, value} = action.payload;
            lightFieldAdapter.updateOne(state, {
                id,
                changes: {
                    [name]: value
                }
            });
        },
        lightFieldVariableChanged: (state, action: PayloadAction<VariablePayload>) => {
            handleVariableAction(state.entities[action.payload.id]?.recipe, action);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(experimentAdded, (state, { payload: { experimentEntity } }) => {
            if (isLightFieldEntity(experimentEntity)) {
                lightFieldAdapter.addOne(state, experimentEntity);
            }
        }).addCase(sequenceImported, (state, {payload}) => {
            return payload.lightField || state; // lightField not exported from old version
        });
    }
});

interface LightFieldAddedPayload extends ExperimentAddedPayload<LightFieldRecipe> {
    experimentEntity: LightFieldEntity
}

export const lightFieldAddedCreator = (payload: LightFieldAddedPayload) => (dispatch: Dispatch<Action<any>>) => {
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
    lightFieldTaskUpdated,
    lightFieldParameterUpdated,
    lightFieldUpdated,
    lightFieldVariableChanged
} = lightFieldSlice.actions;

export default lightFieldSlice.reducer;

const lightFieldSelectors = lightFieldAdapter.getSelectors((state: RootState) => state.lightField);
export const {
    selectById: selectLightFieldById,
} = lightFieldSelectors;