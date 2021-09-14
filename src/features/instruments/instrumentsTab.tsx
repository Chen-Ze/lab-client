import { Box, Button, createStyles, FormControl, IconButton, InputLabel, makeStyles, MenuItem, Paper, Select, TextField, Theme, useTheme } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { EntityId } from '@reduxjs/toolkit';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { selectSetting } from '../setting/settingSlice';
import { defaultInstrumentEntity, instrumentAdded, instrumentAddressUpdated, InstrumentEntity, instrumentNameUpdated, InstrumentPrototype, instrumentPrototypeUpdated, instrumentRemoved, selectAllInstrumentIds, selectInstrumentById } from './instrumentsSlice';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';


const useStyles = makeStyles((theme: Theme) => createStyles({
    box: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        background: theme.palette.background.default,
        padding: theme.spacing(1)
    },
    instrumentInput: {
        width: "25ch",
        margin: theme.spacing(1)
    },
    monospace: {
        fontFamily: "Courier New, monospace",
    },
    instrumentPaper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        margin: theme.spacing(1)
    },
    removeButton: {
        margin: theme.spacing(1)
    },
    removeIconBox: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    instrumentControlBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
    },
    addButton: {
        margin: theme.spacing(1),
        borderRadius: "24px"
    },
}));

interface InstrumentProps {
    id: EntityId
}

const Instrument: React.FC<InstrumentProps> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();

    const { id } = props;
    const entity = useSelector((state: RootState) => selectInstrumentById(state, id)) as InstrumentEntity;
    const setting = useSelector(selectSetting);

    return (
        <Paper variant="outlined" className={classes.instrumentPaper} >
            <Box className={classes.instrumentControlBox} >
                <FormControl className={classes.instrumentInput} variant="outlined" >
                    <TextField
                        variant="outlined"
                        value={entity.name}
                        onChange={e => dispatch(instrumentNameUpdated({
                            id,
                            name: String(e.target.value)
                        }))}
                        label="Name"
                        color="primary"
                    />
                </FormControl>
                <FormControl className={classes.instrumentInput} variant="outlined" >
                    <InputLabel>Address</InputLabel>
                    <Select
                        value={entity.address}
                        onChange={e => dispatch(instrumentAddressUpdated({
                            id,
                            address: String(e.target.value)
                        }))}
                        label="Address"
                        color="primary"
                        className={classes.monospace}
                    >
                        {
                            setting.availableAddresses.map(address => (
                                <MenuItem key={address} value={address} className={classes.monospace} >
                                    {address}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                <FormControl className={classes.instrumentInput} variant="outlined" >
                    <InputLabel>Prototype</InputLabel>
                    <Select
                        value={entity.prototype}
                        onChange={e => dispatch(instrumentPrototypeUpdated({
                            id,
                            prototype: e.target.value as InstrumentPrototype
                        }))}
                        label="Prototype"
                        color="primary"
                    >
                        {
                            Object.values(InstrumentPrototype).map(type => (
                                <MenuItem key={type} value={type} >
                                    {type}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </Box>
            <Box className={classes.removeIconBox} >
                <IconButton onClick={(e) => dispatch(instrumentRemoved(id))} className={classes.removeButton} >
                    <RemoveCircleOutlineIcon color="error" />
                </IconButton>
            </Box>
        </Paper>
    )
}

interface Props {

}

export const InstrumentsTab: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();

    const allIds = useSelector(selectAllInstrumentIds);

    return (
        <Box className={classes.box} >
            {
                allIds.map(id => (
                    <Instrument
                        key={id}
                        id={id}
                    />
                ))
            }
            <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.addButton}
                startIcon={<AddIcon />}
                onClick={(e) => dispatch(instrumentAdded(defaultInstrumentEntity()))}
            >
                Add Instrument
            </Button>
        </Box>
    );
}
