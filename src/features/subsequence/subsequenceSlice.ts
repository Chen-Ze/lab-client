import { createEntityAdapter, createSlice, EntityId, PayloadAction } from "@reduxjs/toolkit";
import { Recipe } from "material-science-experiment-recipes/lib/recipe";
import { RootState } from "../../app/store";
import { sequenceImported } from "../sequence/sequenceSlice";
import { reorder } from "../util/util";


export interface ExperimentEntity<T extends Recipe> {
    id: EntityId,
    type: string,
    enabled: boolean,
    measuring: boolean,
    recipe: T,
    subsequenceId?: EntityId,
};

export interface SubsequenceEntity {
    id: EntityId,
    experiments: Array<EntityId>,
}

const subsequenceAdapter = createEntityAdapter<SubsequenceEntity>({});

const initialState = subsequenceAdapter.getInitialState();

export type SubsequenceState = typeof initialState;

export interface ExperimentAddedPayload<T extends Recipe> {
    subsequenceId: EntityId,
    experimentEntity: ExperimentEntity<T>
}

export interface ExperimentRemovedPayload {
    subsequenceId: EntityId,
    experimentId: EntityId
}

export interface SubsequenceReorderedPayload {
    subsequenceId: EntityId,
    startIndex: number,
    endIndex: number
}

const subsequenceSlice = createSlice({
    name: "subsequence",
    initialState,
    reducers: {
        subsequenceAdded: subsequenceAdapter.addOne,
        commanderSubsequenceAdded: subsequenceAdapter.addOne,
        experimentAdded: (state, action: PayloadAction<ExperimentAddedPayload<Recipe>>) => {
            const { subsequenceId, experimentEntity: { id: experimentId } } = action.payload;
            subsequenceAdapter.updateOne(
                state,
                {
                    id: subsequenceId,
                    changes: {
                        experiments: [...(state.entities[subsequenceId]?.experiments || []), experimentId]
                    }
                }
            );
        },
        experimentRemoved: (state, action: PayloadAction<ExperimentRemovedPayload>) => {
            const { subsequenceId, experimentId } = action.payload;
            subsequenceAdapter.updateOne(
                state,
                {
                    id: subsequenceId,
                    changes: {
                        experiments: state.entities[subsequenceId]?.experiments.filter((id) => id !== experimentId)
                    }
                }
            )
        },
        subsequenceReordered: (state, action: PayloadAction<SubsequenceReorderedPayload>) => {
            const { subsequenceId, startIndex, endIndex } = action.payload;
            subsequenceAdapter.updateOne(
                state,
                {
                    id: subsequenceId,
                    changes: {
                        experiments: reorder(state.entities[subsequenceId]?.experiments, startIndex, endIndex)
                    }
                }
            )
        }
    },
    extraReducers: (builder) => {
        builder.addCase(sequenceImported, (state, {payload}) => {
            return payload.subsequence;
        });
    }
});

export const {
    commanderSubsequenceAdded,
    subsequenceAdded,
    experimentAdded,
    experimentRemoved,
    subsequenceReordered
} = subsequenceSlice.actions;

export default subsequenceSlice.reducer;

const subsequenceSelectors = subsequenceAdapter.getSelectors((state: RootState) => state.subsequence);
export const {
    selectById: selectSubsequenceById,
} = subsequenceSelectors;
