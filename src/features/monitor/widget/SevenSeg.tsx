import { Box, createStyles, makeStyles, Theme, Typography, useTheme } from '@material-ui/core';
import { format } from 'mathjs';
import React from "react";


const DEFAULT_PRECISION = 4;
const DEFAULT_NOTATION = 'engineering';

export const useStyles = makeStyles((theme: Theme) => createStyles({
    sevenSeg: {
        fontFamily: "DSeg7",
    },
    prepend: {
        fontFamily: "Courier New, monospace",
    },
}));

interface Props {
    unit?: string
    precision?: number,
    notation?: "engineering" | "exponential" | "fixed" | "auto",
    color?: string
}

export const SevenSeg: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const { coefficient, mantissa } = format(props.children, {
        notation: props.notation || DEFAULT_NOTATION,
        precision: props.precision || DEFAULT_PRECISION
    }).match(/(?<coefficient>[^e]*)(?<mantissa>e.*)?/)?.groups || { coefficient: "", mantissa: "" };

    return (
        <Box style={{
            color: props.color
        }} >
            <Typography className={classes.sevenSeg} component="span" >
                {coefficient}
            </Typography>
            {(props.unit || mantissa) && <Typography component="span" className={classes.prepend} >{` ${mantissa || ''} ${props.unit}`}</Typography>}
        </Box>
    );
};
