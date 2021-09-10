import { Box, createStyles, FormControl, InputLabel, makeStyles, MenuItem, Select, Slider, TextField, Theme, Typography, useTheme } from '@material-ui/core';
import { GridRowData } from '@mui/x-data-grid';
import { EntityId } from '@reduxjs/toolkit';
import clsx from 'clsx';
import * as math from 'mathjs';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { DataPlot } from '../../../widget/DataPlot';
import { selectDataGridColumns, selectDataGridRows } from '../../data/dataGridSlice';
import { groupRows } from '../../util/rows';
import { lastElement } from '../../util/util';
import { PlotEntity, plotExpressionUpdated, plotSliderChanged, plotSliderSelectedIdChanged, plotStickLastestChanged, plotTraceChanged, selectPlotById } from '../plotSlice';


const DEFAULT_SLIDER_PRECISION = 4;
const DEFAULT_SLIDER_MAX_LABELS = 6;

const useStyles = makeStyles((theme: Theme) => createStyles({
    controlBox: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "baseline",
        flexWrap: "wrap",
    },
    input: {
        width: "25ch",
        margin: theme.spacing(1)
    },
    monospace: {
        fontFamily: "Courier New, monospace",
    },
    sliderBox: {
        padding: theme.spacing(0, 4),
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        overflowX: "hidden",
        maxWidth: "100%"
    }
}));

interface Props {
    id: EntityId
}

const evaluatableRow = (xDependencies: string[], yDependencies: string[], row: GridRowData) => (
    xDependencies.every(variable => !!row[variable]) &&
    yDependencies.every(variable => !!row[variable])
);

function evaluateRows(plotEntity: PlotEntity, rows: GridRowData[]) {
    return rows.filter(
        row => evaluatableRow(plotEntity.xDependencies, plotEntity.yDependencies, row)
    ).map(row => ({
        x: Number(math.evaluate(plotEntity.xExpression, row)),
        y: Number(math.evaluate(plotEntity.yExpression, row))
    }));
}

function getTraces(plotEntity: PlotEntity, rows: GridRowData[]) {
    if (plotEntity.trace) {
        const groupedRows = groupRows(rows, plotEntity.trace);
        return groupedRows.map(group => ({
            points: evaluateRows(plotEntity, group.rows),
            name: `${group.column} = ${group.value}`
        }));
    } else {
        return [{
            points: evaluateRows(plotEntity, rows)
        }]
    }
}

function getData(plotEntity: PlotEntity, rows: GridRowData[]) {
    if (plotEntity.slider) {
        if (!plotEntity.sliderSelectedId) return [];
        const groupedRows = groupRows(rows, plotEntity.slider);
        return getTraces(plotEntity, groupedRows.find(
            group => group.id === plotEntity.sliderSelectedId
        )?.rows || []);
    } else {
        return getTraces(plotEntity, rows);
    }
}

export const SimplePlot: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();

    const columns = useSelector(selectDataGridColumns);

    const plotEntity = useSelector((state: RootState) => selectPlotById(state, props.id)) as PlotEntity;

    const undeclaredXDependencies = plotEntity.xDependencies.filter(
        variable => !columns.map(column => column.field).includes(variable)
    );
    const xDependenciesReady = !undeclaredXDependencies.length;
    const xDependenciesWarning = xDependenciesReady ? '' : `Unsolved variables: ${undeclaredXDependencies.join(', ')}.`;

    const undeclaredYDependencies = plotEntity.yDependencies.filter(
        variable => !columns.map(column => column.field).includes(variable)
    );
    const yDependenciesReady = !undeclaredYDependencies.length;
    const yDependenciesWarning = yDependenciesReady ? '' : `Unsolved variables: ${undeclaredYDependencies.join(', ')}.`;

    const evaluationReady = plotEntity.parsed && xDependenciesReady && yDependenciesReady;
    const rows = useSelector(selectDataGridRows);
    const data = evaluationReady ? getData(plotEntity, rows) : [];

    const groupedRows = groupRows(rows, plotEntity.slider);
    const stickLastest = plotEntity.stickLastest;

    useEffect(() => {
        const groupedRows = groupRows(rows, plotEntity.slider);
        if (stickLastest && groupedRows.length) {
            dispatch(plotSliderSelectedIdChanged({
                id: plotEntity.id,
                sliderSelectedId: lastElement(groupedRows)!.id
            }));
        }
    }, [stickLastest, rows, plotEntity.slider, plotEntity.id, dispatch]);

    const sliderSelectedIndex = groupedRows.findIndex(row => row.id === plotEntity.sliderSelectedId);

    const marks = groupedRows.map((group, index) => ({
        value: index,
        label: typeof(group.value) === "number" ? `${group.value.toPrecision(DEFAULT_SLIDER_PRECISION)}` : `${group.value}`
    })).filter((mark, index) => {
        if (groupedRows.length <= DEFAULT_SLIDER_MAX_LABELS) return true;
        return Array.from(
            Array(DEFAULT_SLIDER_MAX_LABELS).keys()
        ).map(
            i => Math.round((groupedRows.length - 1) * i / (DEFAULT_SLIDER_MAX_LABELS - 1))
        ).includes(index);
    });

    const slider = !!plotEntity.slider && groupRows.length && (
        <Box className={classes.sliderBox} >
            {groupedRows[sliderSelectedIndex] && <Typography className={classes.monospace} >
                {
                    `${groupedRows[sliderSelectedIndex].column} = ${groupedRows[sliderSelectedIndex].value} `
                }
            </Typography>}
            <Slider
                value={sliderSelectedIndex >= 0 ? sliderSelectedIndex : 0}
                valueLabelDisplay="off"
                step={1}
                min={0}
                max={groupedRows.length - 1}
                onChange={(e, value) => {
                    dispatch(plotSliderSelectedIdChanged({
                        id: plotEntity.id,
                        sliderSelectedId: groupedRows[Number(value)]?.id
                    }));
                    dispatch(plotStickLastestChanged({
                        id: plotEntity.id,
                        stickLastest: value === groupedRows.length - 1
                    }))
                }}
                marks={marks}
                classes={{
                    markLabel: classes.monospace
                }}
            />
        </Box>
    );

    return (
        <>
            <Box className={classes.controlBox} >
                <TextField
                    error={!!plotEntity.xWarningText || !xDependenciesReady}
                    label="X"
                    value={plotEntity.xExpression}
                    onChange={(e) => dispatch(plotExpressionUpdated({
                        id: plotEntity.id,
                        axis: 'x',
                        expression: e.target.value
                    }))}
                    helperText={plotEntity.xWarningText || xDependenciesWarning}
                    className={classes.input}
                    InputProps={{
                        className: classes.monospace
                    }}
                />
                <TextField
                    error={!!plotEntity.yWarningText || !yDependenciesReady}
                    label="Y"
                    value={plotEntity.yExpression}
                    onChange={(e) => dispatch(plotExpressionUpdated({
                        id: plotEntity.id,
                        axis: 'y',
                        expression: e.target.value
                    }))}
                    helperText={plotEntity.yWarningText || yDependenciesWarning}
                    className={classes.input}
                    InputProps={{
                        className: classes.monospace
                    }}
                />
            </Box>
            <Box className={classes.controlBox} >
                <FormControl variant="outlined" className={clsx(classes.input, classes.monospace)} >
                    <InputLabel>Slider</InputLabel>
                    <Select
                        value={plotEntity.slider}
                        className={classes.monospace}
                        onChange={(e) => dispatch(plotSliderChanged({
                            id: plotEntity.id,
                            slider: String(e.target.value)
                        }))}
                        label="Slider"
                    >
                        <MenuItem
                            className={classes.monospace}
                            key=''
                            value=''
                        >
                            -
                        </MenuItem>
                        {columns.map((column) => {
                            return (
                                <MenuItem
                                    className={classes.monospace}
                                    key={column.field}
                                    value={column.field}
                                >
                                    {column.field}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
                <FormControl variant="outlined" className={clsx(classes.input, classes.monospace)} >
                    <InputLabel>Trace</InputLabel>
                    <Select
                        value={plotEntity.trace}
                        className={classes.monospace}
                        onChange={(e) => dispatch(plotTraceChanged({
                            id: plotEntity.id,
                            trace: String(e.target.value)
                        }))}
                        label="Trace"
                    >
                        <MenuItem
                            className={classes.monospace}
                            key=''
                            value=''
                        >
                            -
                        </MenuItem>
                        {columns.map((column) => {
                            return (
                                <MenuItem
                                    className={classes.monospace}
                                    key={column.field}
                                    value={column.field}
                                >
                                    {column.field}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </Box>
            {!!slider && slider}
            <DataPlot xLabel={plotEntity.xExpression} yLabel={plotEntity.yExpression} data={data} />
        </>
    )
}
