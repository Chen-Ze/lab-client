import { Box, ClickAwayListener, createStyles, IconButton, makeStyles, Theme, Tooltip, useTheme } from "@material-ui/core";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import FlareIcon from '@material-ui/icons/Flare';
import FunctionsIcon from '@material-ui/icons/Functions';
import HelpIcon from '@material-ui/icons/Help';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import SpeedIcon from '@material-ui/icons/Speed';
import clsx from "clsx";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { defaultKeithley2636Entity, keithley2636AddedCreator } from "../../keithley-2636/keithley2636Slice";
import { defaultPauseEntity, pauseAddedCreator } from "../../pause/pauseSlice";
import { defaultRandomNumberEntity, randomNumberAddedCreator } from "../../random-number/randomNumberSlice";
import { Props } from "../SubsequenceTab";


const useStyles = makeStyles((theme: Theme) => createStyles({
    '@keyframes expand': {
        "0%": { maxWidth: 0 },
        "100%": { maxWidth: "100%" },
    },
    '@keyframes shrink': {
        "0%": { maxWidth: "100%" },
        "100%": { maxWidth: 0 },
    },
    box: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    outerBox: {
        height: "56px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    addButton: {
    },
    innerBox: {
        whiteSpace: "nowrap",
        overflowX: "hidden",
        display: "flex",
        justifyContent: "center",
    },
    animationIn: {
        animationName: '$expand',
        animationDuration: `${theme.transitions.duration.standard}ms`,
        animationTimingFunction: 'ease-in-out',
    },
    animationOut: {
        animationName: '$shrink',
        animationDuration: `${theme.transitions.duration.standard}ms`,
        animationTimingFunction: 'ease-in-out',
    }
}));

export const AddExperiment: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [closing, setClosing] = useState(false);

    const close = () => {
        setClosing(true);
        setTimeout(() => { setOpen(false); setClosing(false); }, theme.transitions.duration.standard);
    }

    const expand = () => {
        if (closing) return;
        setOpen(true);
    }

    return (
        <Box className={clsx(classes.outerBox)}>
            <Box className={clsx(classes.box)}>
                {!open &&
                    <Fab className={classes.addButton}
                        onClick={expand}
                        onMouseOver={expand}
                        color="primary"
                    >
                        <AddIcon />
                    </Fab>}
                {open &&
                    <ClickAwayListener
                        onClickAway={close}
                    >
                        <Box
                            onMouseLeave={close}
                            className={clsx(classes.innerBox, {
                                [classes.animationIn]: open,
                                [classes.animationOut]: closing
                            })}
                        >
                            <Tooltip title="Pause" aria-label="add pause" >
                                <IconButton onClick={() => {
                                    dispatch(pauseAddedCreator({
                                        subsequenceId: props.id,
                                        experimentEntity: defaultPauseEntity()
                                    }));
                                    setOpen(false);
                                }}>
                                    <PlayCircleOutlineIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Keithley 2636" aria-label="add pause" >
                                <IconButton onClick={() => {
                                    dispatch(keithley2636AddedCreator({
                                        subsequenceId: props.id,
                                        experimentEntity: defaultKeithley2636Entity()
                                    }));
                                    setOpen(false);
                                }}>
                                    <SpeedIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Random Number" aria-label="add random number" >
                                <IconButton onClick={() => {
                                    dispatch(randomNumberAddedCreator({
                                        subsequenceId: props.id,
                                        experimentEntity: defaultRandomNumberEntity()
                                    }));
                                    setOpen(false);
                                }}>
                                    <HelpIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="LightField" aria-label="LightField" >
                                <IconButton onClick={() => {
                                    setOpen(false);
                                }}>
                                    <FlareIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Calculator" aria-label="calculator" >
                                <IconButton onClick={() => {
                                    setOpen(false);
                                }}>
                                    <FunctionsIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </ClickAwayListener>
                }
            </Box>
        </Box>
    );
};
