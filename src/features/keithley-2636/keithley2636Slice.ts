import { Action, createEntityAdapter, createSlice, EntityId, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { RootState } from "../../app/store";
import { experimentAdded, ExperimentAddedPayload, ExperimentEntity, subsequenceAdded } from "../subsequence/subsequenceSlice";


const DEFAULT_WAIT  = 100;
const DEFAULT_START = '0';
const DEFAULT_STEP  = '1e-6';
const DEFAULT_STOP  = '1e-5';

export enum SMUMode {
    Off = 'Off',
    Free = 'Free',
    FixedCurrent = 'Fixed Current',
    SweepCurrent = 'Sweep Current',
    FixedVoltage = 'Fixed Voltage',
    SweepVoltage = 'Sweep Voltage'
}

interface Keithley2636SMURecipe {
    smuMode: SMUMode,
    turnOffAfterDone: boolean
}

export interface OffChannelRecipe extends Keithley2636SMURecipe {
    smuMode: SMUMode.Off,
    turnOffAfterDone: true,
}

export function isOffChannelRecipe(recipe: Keithley2636SMURecipe): recipe is OffChannelRecipe {
    return recipe.smuMode === SMUMode.Off;
}

function defaultOffChannelRecipe(): OffChannelRecipe {
    return {
        smuMode: SMUMode.Off,
        turnOffAfterDone: true,
    };
}

export interface FreeChannelRecipe extends Keithley2636SMURecipe {
    smuMode: SMUMode.Free,
    turnOffAfterDone: false,
}

export function isFreeChannelRecipe(recipe: Keithley2636SMURecipe): recipe is FreeChannelRecipe {
    return recipe.smuMode === SMUMode.Free;
}

function defaultFreeChannelRecipe(): FreeChannelRecipe {
    return {
        smuMode: SMUMode.Free,
        turnOffAfterDone: false,
    };
}

export interface FixedChannelRecipe extends Keithley2636SMURecipe {
    smuMode: SMUMode.FixedCurrent | SMUMode.FixedVoltage
    value: string,
}

export function isFixedChannelRecipe(recipe: Keithley2636SMURecipe): recipe is FixedChannelRecipe {
    return recipe.smuMode === SMUMode.FixedCurrent || recipe.smuMode === SMUMode.FixedVoltage;
}

function defaultFixedChannelRecipe(smuMode: SMUMode.FixedCurrent | SMUMode.FixedVoltage): FixedChannelRecipe {
    return {
        smuMode: smuMode,
        turnOffAfterDone: false,
        value: '0'
    };
}

export interface SweepChannelRecipe extends Keithley2636SMURecipe {
    smuMode: SMUMode.SweepCurrent | SMUMode.SweepVoltage,
    start: string,
    stop:  string,
    step:  string
}

export function isSweepChannelRecipe(recipe: Keithley2636SMURecipe): recipe is SweepChannelRecipe {
    return recipe.smuMode === SMUMode.SweepCurrent || recipe.smuMode === SMUMode.SweepVoltage;
}

function defaultSweepChannelRecipe(smuMode: SMUMode.SweepCurrent | SMUMode.SweepVoltage): SweepChannelRecipe {
    return {
        smuMode: smuMode,
        turnOffAfterDone: false,
        start: DEFAULT_START,
        stop:  DEFAULT_STOP,
        step:  DEFAULT_STEP
    };
}

export type SMURecipe = OffChannelRecipe | FreeChannelRecipe | FixedChannelRecipe | SweepChannelRecipe;

function defaultChannelRecipe(smuMode: SMUMode) {
    switch (smuMode) {
        case SMUMode.Off:
            return defaultOffChannelRecipe();
        case SMUMode.Free:
            return defaultFreeChannelRecipe();
        case SMUMode.FixedVoltage:
        case SMUMode.FixedCurrent:
            return defaultFixedChannelRecipe(smuMode);
        case SMUMode.SweepCurrent:
        case SMUMode.SweepVoltage:
            return defaultSweepChannelRecipe(smuMode);
    }
}

export interface Keithley2636Recipe {
    smuARecipe: SMURecipe,
    smuBRecipe: SMURecipe,
    wait: number
}

export interface Keithley2636Entity extends ExperimentEntity {
    type: 'Keithley2636',
    recipe: Keithley2636Recipe,
    subsequenceId: EntityId
}

export function isKeithley2636Entity(entity: ExperimentEntity): entity is Keithley2636Entity {
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
        recipe: {
            smuARecipe: defaultOffChannelRecipe(),
            smuBRecipe: defaultOffChannelRecipe(),
            wait: DEFAULT_WAIT,
        },
        subsequenceId
    };
}

const keithley2636Adapter = createEntityAdapter<Keithley2636Entity>();

const initialState = keithley2636Adapter.getInitialState();

interface Keithley2636UpdatedPayload {
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
    },
    extraReducers: (builder) => {
        builder.addCase(experimentAdded, (state, { payload: { experimentEntity } }) => {
            if (isKeithley2636Entity(experimentEntity)) {
                keithley2636Adapter.addOne(state, experimentEntity);
            }
        });
    }
});

interface Keithley2636AddedPayload extends ExperimentAddedPayload {
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
    }))
}

export const {
    keithley2636Updated,
    keithley2636SMUUpdated,
    keithley2636SMUModeUpdated,
} = keithley2636Slice.actions;

export default keithley2636Slice.reducer;

const keithley2636Selectors = keithley2636Adapter.getSelectors((state: RootState) => state.keithley2636);
export const {
    selectById: selectKeithley2636ById,
} = keithley2636Selectors;
