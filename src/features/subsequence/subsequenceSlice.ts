import { createEntityAdapter, createSlice, EntityId, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { reorder } from "../util/util";


export interface ExperimentEntity {
    id: EntityId,
    type: string,
    enabled: boolean,
    measuring: boolean,
};

export interface SubsequenceEntity {
    id: EntityId,
    experiments: Array<EntityId>,
}

const subsequenceAdapter = createEntityAdapter<SubsequenceEntity>({});

const initialState = subsequenceAdapter.getInitialState();

export interface ExperimentAddedPayload {
    subsequenceId: EntityId,
    experimentEntity: ExperimentEntity
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
        experimentAdded: (state, action: PayloadAction<ExperimentAddedPayload>) => {
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