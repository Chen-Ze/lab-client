import { Action, createEntityAdapter, createSlice, EntityId, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { defaultChannelRecipe, SMUMode } from "material-science-experiment-recipes/lib/keithley-simple/smu-recipe";
import { defaultKeithley2400SimpleRecipe, Keithley2400SimpleRecipe } from "material-science-experiment-recipes/lib/keithley-2400-simple-recipe"
import { Recipe } from "material-science-experiment-recipes/lib/recipe";
import { Dispatch } from "react";
import { RootState } from "../../app/store";
import { sequenceImported } from "../sequence/sequenceSlice";
import { experimentAdded, ExperimentAddedPayload, ExperimentEntity, subsequenceAdded } from "../subsequence/subsequenceSlice";
import { handleVariableAction, VariablePayload } from "../util/variable";


export interface Keithley2400Entity extends ExperimentEntity<Keithley2400SimpleRecipe> {
    type: 'Keithley2400',
    subsequenceId: EntityId
}

export function isKeithley2400Entity(entity: ExperimentEntity<Recipe>): entity is Keithley2400Entity {
    return entity.type === 'Keithley2400';
}

export function defaultKeithley2400Entity(subsequenceId?: EntityId, id?: EntityId): Keithley2400Entity {
    if (!id) id = nanoid();
    if (!subsequenceId) subsequenceId = nanoid();
    return {
        type: 'Keithley2400',
        id,
        enabled: true,
        measuring: false,
        recipe: defaultKeithley2400SimpleRecipe(),
        subsequenceId
    };
}

const keithley2400Adapter = createEntityAdapter<Keithley2400Entity>();

const initialState = keithley2400Adapter.getInitialState();

export type Keithley2400State = typeof initialState;

interface Keithley2400UpdatedPayload {
    id: EntityId,
    name: string,
    value: any
}

interface Keithley2400RecipeUpdatedPayload {
    id: EntityId,
    name: string,
    value: any
}

interface Keithley2400SMUUpdatedPayload {
    id: EntityId,
    name: string,
    value: any
}

interface Keithley2400SMUModeUpdatedPayload {
    id: EntityId,
    smuMode: SMUMode,
}

const keithley2400Slice = createSlice({
    name: "keithley2400",
    initialState,
    reducers: {
        keithley2400Updated: (state, action: PayloadAction<Keithley2400UpdatedPayload>) => {
            const {id, name, value} = action.payload;
            keithley2400Adapter.updateOne(state, {
                id,
                changes: {
                    [name]: value
                }
            });
        },
        keithley2400RecipeUpdated: (state, action: PayloadAction<Keithley2400RecipeUpdatedPayload>) => {
            const {id, name, value} = action.payload;
            const entity = state.entities[id];
            if (!entity) return;
            entity.recipe = {
                ...entity.recipe,
                [name]: value
            }
        },
        keithley2400SMUUpdated: (state, action: PayloadAction<Keithley2400SMUUpdatedPayload>) => {
            const {id, name, value} = action.payload;
            const entity = state.entities[id];
            if (!entity) return;
            entity.recipe.smuRecipe = {
                ...entity.recipe.smuRecipe,
                [name]: value
            }
        },
        keithley2400SMUModeUpdated: (state, action: PayloadAction<Keithley2400SMUModeUpdatedPayload>) => {
            const {id, smuMode} = action.payload;
            const entity = state.entities[id];
            if (!entity) return;
            entity.recipe.smuRecipe = defaultChannelRecipe(smuMode);
        },
        keithley2400VariableChanged: (state, action: PayloadAction<VariablePayload>) => {
            handleVariableAction(state.entities[action.payload.id]?.recipe, action);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(experimentAdded, (state, { payload: { experimentEntity } }) => {
            if (isKeithley2400Entity(experimentEntity)) {
                keithley2400Adapter.addOne(state, experimentEntity);
            }
        }).addCase(sequenceImported, (state, {payload}) => {
            return payload.keithley2400;
        });
    }
});

interface Keithley2400AddedPayload extends ExperimentAddedPayload<Keithley2400SimpleRecipe> {
    experimentEntity: Keithley2400Entity
}

export const keithley2400AddedCreator = (payload: Keithley2400AddedPayload) => (dispatch: Dispatch<Action<any>>) => {
    dispatch(subsequenceAdded({
        id: payload.experimentEntity.subsequenceId,
        experiments: []
    }));
    dispatch(experimentAdded({
        subsequenceId: payload.subsequenceId,
        experimentEntity: payload.experimentEntity
    }))
}

export const {
    keithley2400Updated,
    keithley2400RecipeUpdated,
    keithley2400SMUUpdated,
    keithley2400SMUModeUpdated,
    keithley2400VariableChanged
} = keithley2400Slice.actions;

export default keithley2400Slice.reducer;

const keithley2400Selectors = keithley2400Adapter.getSelectors((state: RootState) => state.keithley2400);
export const {
    selectById: selectKeithley2400ById,
} = keithley2400Selectors;
