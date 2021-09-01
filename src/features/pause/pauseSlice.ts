import { Action, createEntityAdapter, createSlice, EntityId, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { RootState } from "../../app/store";
import { experimentAdded, ExperimentAddedPayload, ExperimentEntity } from "../subsequence/subsequenceSlice";


export interface PauseEntity extends ExperimentEntity {
    type: 'Pause',
};

export function isPauseEntity(entity: ExperimentEntity): entity is PauseEntity {
    return entity.type === 'Pause';
}

export function defaultPauseEntity(id?: EntityId): PauseEntity {
    if (!id) id = nanoid();
    return {
        type: 'Pause',
        id,
        enabled: true,
        measuring: false,
    };
}

const pauseAdapter = createEntityAdapter<PauseEntity>();

const initialState = pauseAdapter.getInitialState();

interface PauseUpdatedPayload {
    id: EntityId,
    name: string,
    value: any
}

const pauseSlice = createSlice({
    name: "pause",
    initialState,
    reducers: {
        pauseUpdated: (state, action: PayloadAction<PauseUpdatedPayload>) => {
            const {id, name, value} = action.payload;
            pauseAdapter.updateOne(state, {
                id,
                changes: {
                    [name]: value
                }
            });
        }
    },
    extraReducers: (builder) => {
        builder.addCase(experimentAdded, (state, { payload: { experimentEntity } }) => {
            if (isPauseEntity(experimentEntity))
                pauseAdapter.addOne(state, experimentEntity);
        });
    }
});

interface PauseAddedPayload extends ExperimentAddedPayload {
    experimentEntity: PauseEntity
}

export const pauseAddedCreator = (payload: PauseAddedPayload) => (dispatch: Dispatch<Action<any>>) => {
    dispatch(experimentAdded({
        subsequenceId: payload.subsequenceId,
        experimentEntity: payload.experimentEntity
    }))
}

export const {
    pauseUpdated
} = pauseSlice.actions;

export default pauseSlice.reducer;

const pauseSelectors = pauseAdapter.getSelectors((state: RootState) => state.pause);
export const {
    selectById: selectPauseById,
} = pauseSelectors;
