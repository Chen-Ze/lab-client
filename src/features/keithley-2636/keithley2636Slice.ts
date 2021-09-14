import { Action, createEntityAdapter, createSlice, EntityId, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { defaultChannelRecipe, SMUMode } from "material-science-experiment-recipes/lib/keithley-simple/smu-recipe";
import { defaultKeithley2636SimpleRecipe, Keithley2636SimpleRecipe } from "material-science-experiment-recipes/lib/keithley-2636-simple-recipe"
import { Recipe } from "material-science-experiment-recipes/lib/recipe";
import { Dispatch } from "react";
import { RootState } from "../../app/store";
import { sequenceImported } from "../sequence/sequenceSlice";
import { experimentAdded, ExperimentAddedPayload, ExperimentEntity, subsequenceAdded } from "../subsequence/subsequenceSlice";
import { handleVariableAction, VariablePayload } from "../util/variable";


export interface Keithley2636Entity extends ExperimentEntity<Keithley2636SimpleRecipe> {
    type: 'Keithley2636',
    subsequenceId: EntityId
}

export function isKeithley2636Entity(entity: ExperimentEntity<Recipe>): entity is Keithley2636Entity {
    return entity.type === 'Keithley2636';
}

export function defaultKeithley2636Entity(subsequenceId?: EntityId, id?: EntityId): Keithley2636Entity {
    if (!id) id = nanoid();
    if (!subsequenceId) subsequenceId = nanoid();
    return {
        type: 'Keithley2636',
        id,
        enabled: true,
        measuring: false,
        recipe: defaultKeithley2636SimpleRecipe(),
        subsequenceId
    };
}

const keithley2636Adapter = createEntityAdapter<Keithley2636Entity>();

const initialState = keithley2636Adapter.getInitialState();

export type Keithley2636State = typeof initialState;

interface Keithley2636UpdatedPayload {
    id: EntityId,
    name: string,
    value: any
}

interface Keithley2636RecipeUpdatedPayload {
    id: EntityId,
    name: string,
    value: any
}

interface Keithley2636SMUUpdatedPayload {
    id: EntityId,
    smu: 'smuA' | 'smuB',
    name: string,
    value: any
}

interface Keithley2636SMUModeUpdatedPayload {
    id: EntityId,
    smu: 'smuA' | 'smuB',
    smuMode: SMUMode,
}

const keithley2636Slice = createSlice({
    name: "keithley2636",
    initialState,
    reducers: {
        keithley2636Updated: (state, action: PayloadAction<Keithley2636UpdatedPayload>) => {
            const {id, name, value} = action.payload;
            keithley2636Adapter.updateOne(state, {
                id,
                changes: {
                    [name]: value
                }
            });
        },
        keithley2636RecipeUpdated: (state, action: PayloadAction<Keithley2636RecipeUpdatedPayload>) => {
            const {id, name, value} = action.payload;
            const entity = state.entities[id];
            if (!entity) return;
            entity.recipe = {
                ...entity.recipe,
                [name]: value
            }
        },
        keithley2636SMUUpdated: (state, action: PayloadAction<Keithley2636SMUUpdatedPayload>) => {
            const {id, smu, name, value} = action.payload;
            const entity = state.entities[id];
            if (!entity) return;
            switch (smu) {
                case 'smuA':
                    entity.recipe.smuARecipe = {
                        ...entity.recipe.smuARecipe,
                        [name]: value
                    }
                    break;
                case 'smuB':
                    entity.recipe.smuBRecipe = {
                        ...entity.recipe.smuBRecipe,
                        [name]: value
                    }
                    break;
            }
        },
        keithley2636SMUModeUpdated: (state, action: PayloadAction<Keithley2636SMUModeUpdatedPayload>) => {
            const {id, smu, smuMode} = action.payload;
            const entity = state.entities[id];
            if (!entity) return;
            switch (smu) {
                case 'smuA':
                    entity.recipe.smuARecipe = defaultChannelRecipe(smuMode);
                    break;
                case 'smuB':
                    entity.recipe.smuBRecipe = defaultChannelRecipe(smuMode);
                    break;
            }
        },
        keithley2636VariableChanged: (state, action: PayloadAction<VariablePayload>) => {
            handleVariableAction(state.entities[action.payload.id]?.recipe, action);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(experimentAdded, (state, { payload: { experimentEntity } }) => {
            if (isKeithley2636Entity(experimentEntity)) {
                keithley2636Adapter.addOne(state, experimentEntity);
            }
        }).addCase(sequenceImported, (state, {payload}) => {
            return payload.keithley2636;
        });
    }
});

interface Keithley2636AddedPayload extends ExperimentAddedPayload<Keithley2636SimpleRecipe> {
    experimentEntity: Keithley2636Entity
}

export const keithley2636AddedCreator = (payload: Keithley2636AddedPayload) => (dispatch: Dispatch<Action<any>>) => {
    dispatch(subsequenceAdded({
        id: payload.experimentEntity.subsequenceId,
        experiments: []
    }));
    dispatch(experimentAdded({
        subsequenceId: payload.subsequenceId,
        experimentEntity: payload.experimentEntity
    }));
}

export const {
    keithley2636Updated,
    keithley2636RecipeUpdated,
    keithley2636SMUUpdated,
    keithley2636SMUModeUpdated,
    keithley2636VariableChanged
} = keithley2636Slice.actions;

export default keithley2636Slice.reducer;

const keithley2636Selectors = keithley2636Adapter.getSelectors((state: RootState) => state.keithley2636);
export const {
    selectById: selectKeithley2636ById,
} = keithley2636Selectors;
