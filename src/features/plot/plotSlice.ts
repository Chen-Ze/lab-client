import { createEntityAdapter, createSlice, EntityId, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import * as math from 'mathjs';
import { sequenceImported } from "../sequence/sequenceSlice";


export interface PlotEntity {
    id: EntityId,
    xExpression: string,
    xDependencies: string[],
    xWarningText: string,
    yExpression: string,
    yDependencies: string[],
    yWarningText: string,
    parsed: boolean,
    slider: string,
    trace: string,
    sliderSelectedId?: string,
    stickLastest: boolean,
};

export function defaultPlotEntity(id?: EntityId): PlotEntity {
    if (!id) id = nanoid();
    return {
        id,
        xExpression: '',
        xDependencies: [],
        xWarningText: '',
        yExpression: '',
        yDependencies: [],
        yWarningText: '',
        parsed: false,
        slider: '',
        trace: '',
        stickLastest: true
    };
}

const plotAdapter = createEntityAdapter<PlotEntity>();

const initialState = plotAdapter.getInitialState();

export type PlotState = typeof initialState;

interface PlotExpressionUpdatedPayload {
    id: EntityId
    axis: 'x' | 'y',
    expression: string
}

const plotSlice = createSlice({
    name: "pause",
    initialState,
    reducers: {
        plotAdded: plotAdapter.addOne,
        plotExpressionUpdated: (state, action: PayloadAction<PlotExpressionUpdatedPayload>) => {
            const {id, axis, expression} = action.payload;
            const expressionLabel  = axis === 'x' ? 'xExpression' : 'yExpression';
            const dependencyLabel  = axis === 'x' ? 'xDependencies' : 'yDependencies';
            const warningTextLabel = axis === 'x' ? 'xWarningText' : 'yWarningText';

            let dependencies: string[] = [];
            let parsed: math.MathNode;

            try {
                parsed = math.parse(expression);
            } catch (e) {
                plotAdapter.updateOne(state, {
                    id,
                    changes: {
                        [expressionLabel]: expression,
                        [warningTextLabel]: "Parsing Error",
                        parsed: false
                    }
                });
                return;
            }

            dependencies = parsed.filter(
                node => node.isSymbolNode
            ).map(
                node => node.name
            ).filter(
                (name): name is string => !!name
            ).filter(
                name => !Object.keys(math).includes(name)
            );
            
            plotAdapter.updateOne(state, {
                id,
                changes: {
                    [expressionLabel]: expression,
                    [dependencyLabel]: dependencies,
                    [warningTextLabel]: '',
                    parsed: true
                }
            });
        },
        plotSliderChanged: (state, action: PayloadAction<{id: EntityId, slider: string}>) => {
            const {id, slider} = action.payload;
            plotAdapter.updateOne(state, {
                id,
                changes: {
                    slider
                }
            });
        },
        plotSliderSelectedIdChanged: (state, action: PayloadAction<{id: EntityId, sliderSelectedId: string}>) => {
            const {id, sliderSelectedId} = action.payload;
            plotAdapter.updateOne(state, {
                id,
                changes: {
                    sliderSelectedId
                }
            });
        },
        plotTraceChanged: (state, action: PayloadAction<{id: EntityId, trace: string}>) => {
            const {id, trace} = action.payload;
            plotAdapter.updateOne(state, {
                id,
                changes: {
                    trace
                }
            });
        },
        plotStickLastestChanged: (state, action: PayloadAction<{id: EntityId, stickLastest: boolean}>) => {
            const {id, stickLastest} = action.payload;
            plotAdapter.updateOne(state, {
                id,
                changes: {
                    stickLastest
                }
            });
        },
        plotRemoved: plotAdapter.removeOne,
    },
    extraReducers: (builder) => {
        builder.addCase(sequenceImported, (state, {payload}) => {
            return payload.plot;
        });
    }
});

export const {
    plotAdded,
    plotExpressionUpdated,
    plotSliderChanged,
    plotTraceChanged,
    plotSliderSelectedIdChanged,
    plotStickLastestChanged,
    plotRemoved
} = plotSlice.actions;

export default plotSlice.reducer;

const plotSelectors = plotAdapter.getSelectors((state: RootState) => state.plot);
export const {
    selectById: selectPlotById,
    selectAll: selectAllPlots,
    selectIds: selectAllPlotIds
} = plotSelectors;
