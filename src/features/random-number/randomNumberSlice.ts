import { Action, createEntityAdapter, createSlice, EntityId, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { defaultRandomNumberRecipe, RandomNumberRecipe } from "material-science-experiment-recipes/lib/random-number-recipe";
import { Recipe } from "material-science-experiment-recipes/lib/recipe";
import { Dispatch } from "react";
import { RootState } from "../../app/store";
import { sequenceImported } from "../sequence/sequenceSlice";
import { experimentAdded, ExperimentAddedPayload, ExperimentEntity, subsequenceAdded } from "../subsequence/subsequenceSlice";
import { handleVariableAction, VariablePayload } from "../util/variable";


export interface RandomNumberEntity extends ExperimentEntity<RandomNumberRecipe> {
    type: 'RandomNumber',
    subsequenceId: EntityId
}

export function isRandomNumberEntity(entity: ExperimentEntity<Recipe>): entity is RandomNumberEntity {
    return entity.type === 'RandomNumber';
}

export function defaultRandomNumberEntity(subsequenceId?: EntityId, id?: EntityId): RandomNumberEntity {
    if (!id) id = nanoid();
    if (!subsequenceId) subsequenceId = nanoid();
    return {
        type: 'RandomNumber',
        id,
        enabled: true,
        measuring: false,
        recipe: defaultRandomNumberRecipe(),
        subsequenceId
    };
}

const randomNumberAdapter = createEntityAdapter<RandomNumberEntity>();

const initialState = randomNumberAdapter.getInitialState();

export type RandomNumberState = typeof initialState;

interface RandomNumberUpdatedPayload {
    id: EntityId,
    name: string,
    value: any
}

interface RandomNumberCountChangedPayload {
    id: EntityId,
    count: string
}

interface RandomNumberGeneratorAddedPayload {
    id: EntityId,
    name?: string
}

interface RandomNumberGeneratorRemovedPayload {
    id: EntityId,
    index: number
}

interface RandomNumberGeneratorChangedPayload {
    id: EntityId,
    index: number,
    key: string,
    value: string
}

const randomNumberSlice = createSlice({
    name: "randomNumber",
    initialState,
    reducers: {
        randomNumberUpdated:  (state, action: PayloadAction<RandomNumberUpdatedPayload>) => {
            const {id, name, value} = action.payload;
            randomNumberAdapter.updateOne(state, {
                id,
                changes: {
                    [name]: value
                }
            });
        },
        randomNumberCountChanged: (state, action: PayloadAction<RandomNumberCountChangedPayload>) => {
            const {id, count} = action.payload;
            const entity = state.entities[id];
            if (!entity) return;
            entity.recipe.count = count;
        },
        randomNumberGeneratorAdded: (state, action: PayloadAction<RandomNumberGeneratorAddedPayload>) => {
            const {id} = action.payload;
            const entity = state.entities[id];
            if (!entity) return;
            entity.recipe.generators.push({
                name: action.payload.name || '',
                min: '0',
                max: '1'
            })
        },
        randomNumberGeneratorRemoved: (state, action: PayloadAction<RandomNumberGeneratorRemovedPayload>) => {
            const {id, index} = action.payload;
            const entity = state.entities[id];
            if (!entity) return;
            entity.recipe.generators.splice(index, 1);
        },
        randomNumberGeneratorChanged: (state, action: PayloadAction<RandomNumberGeneratorChangedPayload>) => {
            const {id, index, key, value} = action.payload;
            const entity = state.entities[id];
            if (!entity || !entity.recipe.generators[index]) return;
            if (key === "name" && entity.recipe.generators.findIndex((generator) => generator.name === value) >= 0) {
                return; // name duplicates
            }
            entity.recipe.generators[index] = {
                ...entity.recipe.generators[index],
                [key]: value.replace(/\[|\]/g, '')
            }
        },
        randomNumberVariableChanged: (state, action: PayloadAction<VariablePayload>) => {
            handleVariableAction(state.entities[action.payload.id]?.recipe, action);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(experimentAdded, (state, { payload: { experimentEntity } }) => {
            if (isRandomNumberEntity(experimentEntity)) {
                randomNumberAdapter.addOne(state, experimentEntity);
            }
        }).addCase(sequenceImported, (state, {payload}) => {
            return payload.randomNumber;
        });
    }
});

interface RandomNumberAddedPayload extends ExperimentAddedPayload<RandomNumberRecipe> {
    experimentEntity: RandomNumberEntity
}

export const randomNumberAddedCreator = (payload: RandomNumberAddedPayload) => (dispatch: Dispatch<Action<any>>) => {
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
    randomNumberUpdated,
    randomNumberCountChanged,
    randomNumberGeneratorAdded,
    randomNumberGeneratorChanged,
    randomNumberGeneratorRemoved,
    randomNumberVariableChanged
} = randomNumberSlice.actions;

export default randomNumberSlice.reducer;

const randomNumberSelectors = randomNumberAdapter.getSelectors((state: RootState) => state.randomNumber);
export const {
    selectById: selectRandomNumberById,
} = randomNumberSelectors;
