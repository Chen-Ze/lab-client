import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, Theme } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import { SMUMode } from 'material-science-experiment-recipes/lib/keithley-simple/smu-recipe';


const useStyles = makeStyles((theme: Theme) => createStyles({
    select: {
        width: "20ch",
    }
}));

interface Props {
    setMode: (mode: SMUMode) => void,
    mode: SMUMode,
    fixedModeOnly: boolean,
}

export const ModeSelect: React.FC<Props> = (props) => {
    const classes = useStyles();

    return (
        <FormControl className={classes.select} variant="outlined">
            <InputLabel>Mode</InputLabel>
            <Select
                value={props.mode}
                onChange={e => {
                    props.setMode(String(e.target.value) as SMUMode);
                }}
                label="Mode"
            >
                <MenuItem value={SMUMode.Off}>
                    <em>Off</em>
                </MenuItem>
                <MenuItem value={SMUMode.Free}>
                    Free
                </MenuItem>
                <MenuItem value={SMUMode.FixedCurrent}>Fixed Current</MenuItem>
                {!props.fixedModeOnly && <MenuItem value={SMUMode.SweepCurrent}>Sweep Current</MenuItem>}
                <MenuItem value={SMUMode.FixedVoltage}>Fixed Voltage</MenuItem>
                {!props.fixedModeOnly && <MenuItem value={SMUMode.SweepVoltage}>Sweep Voltage</MenuItem>}
            </Select>
        </FormControl>
    );
}
