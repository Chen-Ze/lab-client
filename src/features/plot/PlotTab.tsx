import { Box, createStyles, IconButton, makeStyles, Paper, Theme, useTheme } from '@material-ui/core';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DockTabProps } from '../dock/dock-properties';
import { defaultPlotEntity, plotAdded, plotRemoved, selectAllPlotIds } from './plotSlice';
import { SimplePlot } from './widget/SimplePlot';
import DeleteIcon from '@material-ui/icons/Delete';


const useStyles = makeStyles((theme: Theme) => createStyles({
    box: {
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        flexWrap: "wrap",
        padding: theme.spacing(1)
    },
    plotWrapper: {
        maxWidth: "100%",
        width: "640px",
        margin: theme.spacing(2),
        padding: theme.spacing(1),
        position: 'relative'
    },
    speedDial: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(4),
    },
    removeIcon: {
        position: 'absolute',
        bottom: theme.spacing(2),
        left: theme.spacing(2)
    }
}));

interface SpeedDialProps {
}

const PlotSpeedDial: React.FC<SpeedDialProps> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const actions = [
        {
            icon: <ShowChartIcon />,
            name: 'Simple Plot',
            callback: () => {
                dispatch(plotAdded(defaultPlotEntity()));
            }
        },
    ];

    return (
        <SpeedDial
            ariaLabel="Plot speedDial"
            className={classes.speedDial}
            icon={<SpeedDialIcon />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
        >
            {actions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    tooltipOpen
                    onClick={() => { action.callback(); handleClose(); }}
                />
            ))}
        </SpeedDial>
    );
}

interface Props extends DockTabProps {

}

export const PlotTab: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();

    const allIds = useSelector(selectAllPlotIds);

    return (
        <Box className={classes.box} >
            {
                allIds.map(id => (
                    <Paper key={id} className={classes.plotWrapper} variant="outlined" >
                        <SimplePlot id={id} />
                        <IconButton onClick={() => dispatch(plotRemoved(id))} className={classes.removeIcon} >
                            <DeleteIcon color="error" fontSize="small" />
                        </IconButton>
                    </Paper>
                ))
            }
            <PlotSpeedDial />
        </Box>
    );
}
