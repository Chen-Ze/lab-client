import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, OutlinedInput, Select, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { ActionCreatorWithPayload, EntityId } from '@reduxjs/toolkit';
import { AvailableVariables, Recipe } from 'material-science-experiment-recipes/lib/recipe';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectDataGridColumns } from '../features/data/dataGridSlice';
import { VariableAction, VariablePayload } from '../features/util/variable';


const useStyles = makeStyles((theme: Theme) => createStyles({
    input: {
        fontFamily: "Courier New, monospace",
    },
    monospace: {
        fontFamily: "Courier New, monospace",
    },
    variableControl: {
        width: "15ch"
    }
}));

interface RowProps {
    name: string,
    scope: string,
    declare: boolean,
    onDeclarationChanged: (declare: boolean) => void,
    alias: string,
    onAliasChanged: (alias: string) => void,
    export: boolean,
    onExportChanged: (exportFlag: boolean) => void,
    column: string,
    onColumnChanged: (column: string) => void,
}

export const VariableRow: React.FC<RowProps> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const columns = useSelector(selectDataGridColumns);

    return (
        <TableRow key={props.name} >
            <TableCell component="th" scope="row">
                <Typography className={classes.monospace} >
                    {props.name}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Typography>
                    {props.scope}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <FormControl margin="dense" >
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={props.declare}
                                color="primary"
                                onChange={(e) => props.onDeclarationChanged(e.target.checked)}
                            />
                        }
                        label="Declare"
                    />
                </FormControl>
                <FormControl variant="outlined" margin="dense" className={classes.variableControl} >
                    <InputLabel>Name</InputLabel>
                    <OutlinedInput
                        value={props.alias}
                        disabled={!props.declare}
                        label={"Name"}
                        className={classes.input}
                        onChange={(e) => props.onAliasChanged(String(e.target.value))}
                    />
                </FormControl>
            </TableCell>
            <TableCell align="center">
                <FormControl margin="dense" >
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={props.export}
                                color="primary"
                                onChange={(e) => props.onExportChanged(e.target.checked)}
                            />
                        }
                        label="Export"
                    />
                </FormControl>
                <FormControl variant="outlined" margin="dense" className={classes.variableControl} >
                    <Select
                        value={props.column}
                        disabled={!props.export}
                        className={classes.monospace}
                        onChange={(e) => props.onColumnChanged(String(e.target.value))}
                    >
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
            </TableCell>
        </TableRow>
    )
}

interface Props {
    id: EntityId,
    availableVariables: AvailableVariables,
    recipe: Recipe,
    variableActionCreator: ActionCreatorWithPayload<VariablePayload, string>
}

export const VariableTable: React.FC<Props> = (props) => {
    const dispatch = useDispatch();

    if (props.availableVariables.private.length + props.availableVariables.public.length === 0) {
        return (<></>);
    }

    return (
        <TableContainer component={Paper} variant="outlined" >
            <Table aria-label="variable table" >
                <TableBody>
                    {props.availableVariables.private.map((name) => (
                        <VariableRow
                            key={name}
                            {...{ name }}
                            scope="private"
                            declare={props.recipe.privateVariables.findIndex(variable => variable.name === name) >= 0}
                            onDeclarationChanged={(declare) => {
                                if (declare) {
                                    dispatch(props.variableActionCreator({
                                        id: props.id,
                                        action: VariableAction.AddDeclaration,
                                        name,
                                        scope: 'private',
                                        destination: name
                                    }))
                                } else {
                                    dispatch(props.variableActionCreator({
                                        id: props.id,
                                        action: VariableAction.RemoveDeclaration,
                                        name,
                                        scope: 'private',
                                        destination: ''
                                    }))
                                }
                            }}
                            alias={props.recipe.privateVariables.find(variable => variable.name === name)?.alias || ''}
                            onAliasChanged={(alias) => {
                                dispatch(props.variableActionCreator({
                                    id: props.id,
                                    action: VariableAction.ChangeDeclaration,
                                    name,
                                    scope: 'private',
                                    destination: alias
                                }))
                            }}
                            export={props.recipe.privateExports.findIndex(variable => variable.name === name) >= 0}
                            onExportChanged={(exportFlag) => {
                                if (exportFlag) {
                                    dispatch(props.variableActionCreator({
                                        id: props.id,
                                        action: VariableAction.AddExport,
                                        name,
                                        scope: 'private',
                                        destination: ''
                                    }))
                                } else {
                                    dispatch(props.variableActionCreator({
                                        id: props.id,
                                        action: VariableAction.RemoveExport,
                                        name,
                                        scope: 'private',
                                        destination: ''
                                    }))
                                }
                            }}
                            column={props.recipe.privateExports.find(variable => variable.name === name)?.column || ''}
                            onColumnChanged={(column) => {
                                dispatch(props.variableActionCreator({
                                    id: props.id,
                                    action: VariableAction.ChangeExport,
                                    name,
                                    scope: 'private',
                                    destination: column
                                }))
                            }}
                        />
                    ))}
                    {props.availableVariables.public.map((name) => (
                        <VariableRow
                            key={name}
                            {...{ name }}
                            scope="public"
                            declare={props.recipe.publicVariables.findIndex(variable => variable.name === name) >= 0}
                            onDeclarationChanged={(declare) => {
                                if (declare) {
                                    dispatch(props.variableActionCreator({
                                        id: props.id,
                                        action: VariableAction.AddDeclaration,
                                        name,
                                        scope: 'public',
                                        destination: name
                                    }))
                                } else {
                                    dispatch(props.variableActionCreator({
                                        id: props.id,
                                        action: VariableAction.RemoveDeclaration,
                                        name,
                                        scope: 'public',
                                        destination: ''
                                    }))
                                }
                            }}
                            alias={props.recipe.publicVariables.find(variable => variable.name === name)?.alias || ''}
                            onAliasChanged={(alias) => {
                                dispatch(props.variableActionCreator({
                                    id: props.id,
                                    action: VariableAction.ChangeDeclaration,
                                    name,
                                    scope: 'public',
                                    destination: alias
                                }))
                            }}
                            export={props.recipe.publicExports.findIndex(variable => variable.name === name) >= 0}
                            onExportChanged={(exportFlag) => {
                                if (exportFlag) {
                                    dispatch(props.variableActionCreator({
                                        id: props.id,
                                        action: VariableAction.AddExport,
                                        name,
                                        scope: 'public',
                                        destination: ''
                                    }))
                                } else {
                                    dispatch(props.variableActionCreator({
                                        id: props.id,
                                        action: VariableAction.RemoveExport,
                                        name,
                                        scope: 'public',
                                        destination: ''
                                    }))
                                }
                            }}
                            column={props.recipe.publicExports.find(variable => variable.name === name)?.column || ''}
                            onColumnChanged={(column) => {
                                dispatch(props.variableActionCreator({
                                    id: props.id,
                                    action: VariableAction.ChangeExport,
                                    name,
                                    scope: 'public',
                                    destination: column
                                }))
                            }}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}