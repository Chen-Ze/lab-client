import { Collapse, FormControl, IconButton, InputLabel, MenuItem, PaletteType, Select } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { keithley2636AddressSet, selectSetting } from '../features/setting/settingSlice';


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
}));

interface Props {
    paletteType: PaletteType,
    setPaletteType: (type: PaletteType) => void,
}

export const Topbar: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();

    const setting = useSelector(selectSetting);

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
                    <IconButton onClick={(e) => { }} >
                        <PlayArrowIcon className={classes.start} fontSize="large" />
                    </IconButton>
                </FormControl>
            </Toolbar>
            <Collapse in={expanded} timeout="auto" >
                <Toolbar>
                    <FormControl className={classes.select} variant="outlined" >
                        <InputLabel>Keithley 2636 Address</InputLabel>
                        <Select
                            value={setting.keithley2636Address}
                            onChange={e => dispatch(keithley2636AddressSet(String(e.target.value)))}
                            label="Keithley 2636 Address"
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
                </Toolbar>
            </Collapse>
        </AppBar >
    );
}
