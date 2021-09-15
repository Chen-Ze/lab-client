import { Collapse, FormControl, IconButton, InputLabel, MenuItem, PaletteType, Select } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import axios from 'axios';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { currentExperimentIdSet, selectAvailableExperimentIdList, selectCurrentExperimentId } from '../features/experiments/experimentsSlice';
import { InstrumentsTab } from '../features/instruments/instrumentsTab';
import { compileCommander } from '../features/util/selector';
import { revertPaletteType } from '../features/util/styles';
import StopIcon from '@material-ui/icons/Stop';


const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        flexGrow: 1,
    },
    appBar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.primary[theme.palette.type]
    },
    select: {
        width: "25ch",
        margin: theme.spacing(1)
    },
    start: {
        color: theme.palette.success[theme.palette.type]
    },
    stop: {
        color: theme.palette.error[theme.palette.type]
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    monospace: {
        fontFamily: "Courier New, monospace",
    },
    toolbar: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        "& > *": {
            flexShrink: 0
        }
    },
    collapse: {
        width: "100%"
    }
}));

function ExecutionButton() {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();

    const compiled = useSelector(compileCommander);

    const execute = async () => {
        const id = (await axios.post('/server/new-experiment', JSON.stringify(compiled), {
            headers: { "Content-Type": "application/json" }
        })).data.id;
        dispatch(currentExperimentIdSet(id));
    };

    return (
        <IconButton onClick={execute} >
            <PlayArrowIcon className={classes.start} fontSize="large" />
        </IconButton>
    );
}

function StopButton() {
    const theme = useTheme();
    const classes = useStyles(theme);
    const currentExperimentId = useSelector(selectCurrentExperimentId);

    const stop = async () => {
        axios.get(`/server/halt-experiment?id=${currentExperimentId}`);
    };

    return (
        <IconButton onClick={stop} >
            <StopIcon className={classes.stop} fontSize="large" />
        </IconButton>
    );
}

interface Props {
    paletteType: PaletteType,
    setPaletteType: (type: PaletteType) => void,
}

function experimentStatusToColor(status: string, theme: Theme) {
    switch (status) {
        case 'Created':
            return theme.palette.secondary[revertPaletteType(theme.palette.type)];
        case 'Started':
            return theme.palette.success[revertPaletteType(theme.palette.type)];
        case 'Terminated':
            return theme.palette.primary[revertPaletteType(theme.palette.type)];
        default:
            return theme.palette.secondary[revertPaletteType(theme.palette.type)];
    }
}

export const Topbar: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();

    const availableExperimentIdList = useSelector(selectAvailableExperimentIdList);
    const currentExperimentId = useSelector(selectCurrentExperimentId);

    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <AppBar position="relative" className={classes.appBar} >
            <Toolbar>
                <FormControl variant="outlined" >
                    <IconButton onClick={handleExpandClick} >
                        <ExpandMoreIcon
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: expanded,
                            })}
                            color="primary"
                            fontSize="large"
                        />
                    </IconButton>
                </FormControl>
                <FormControl variant="outlined" >
                    {props.paletteType === "dark" && <IconButton onClick={e => props.setPaletteType('light')}>
                        <BrightnessHighIcon color="primary" fontSize="large" />
                    </IconButton>}
                    {props.paletteType === "light" && <IconButton onClick={e => props.setPaletteType('dark')}>
                        <Brightness4Icon color="primary" fontSize="large" />
                    </IconButton>}
                </FormControl>
                <FormControl variant="outlined" >
                    {!currentExperimentId && <ExecutionButton />}
                    {currentExperimentId && <StopButton />}
                </FormControl>
            </Toolbar>
            <Collapse in={expanded} timeout="auto" className={classes.collapse} >
                <Toolbar className={classes.toolbar} >
                    <FormControl className={classes.select} variant="outlined" >
                        <InputLabel>Watch Experiment</InputLabel>
                        <Select
                            value={availableExperimentIdList.map(item => item.id).includes(currentExperimentId) ? currentExperimentId : ''}
                            onChange={e => dispatch(currentExperimentIdSet(String(e.target.value)))}
                            label="Watch Experiment"
                            color="primary"
                            className={classes.monospace}
                        >
                            {
                                availableExperimentIdList.map(({id, status}) => (
                                    <MenuItem key={id} value={id} className={classes.monospace}
                                        style={{
                                            color: experimentStatusToColor(status, theme)
                                        }}
                                    >
                                        {`${id}`}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Toolbar>
                <InstrumentsTab />
            </Collapse>
        </AppBar >
    );
}
