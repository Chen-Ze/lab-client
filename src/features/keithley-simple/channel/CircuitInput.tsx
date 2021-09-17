import { createStyles, InputAdornment, TextField, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';


const useStyles = makeStyles((theme: Theme) => createStyles({
    input: {
        fontFamily: "Courier New, monospace",
    },
}));

interface Props {
    value: String,
    label: String,
    unit: String,
    error?: boolean,
    helperText?: string,
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
}

export const CircuitInput: React.FC<Props> = (props) => {
    const classes = useStyles();

    return (
        <TextField
            value={props.value}
            onChange={props.onChange}
            label={props.label}
            error={props.error}
            helperText={props.helperText}
            InputProps={{
                endAdornment: <InputAdornment position="end">{props.unit}</InputAdornment>,
                className: classes.input
            }}
        />
    );
}
