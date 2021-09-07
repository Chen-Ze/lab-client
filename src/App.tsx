import { Box, createStyles, createTheme, CssBaseline, Grid, makeStyles, PaletteType, Theme, ThemeProvider, useTheme } from '@material-ui/core';
import { nanoid } from '@reduxjs/toolkit';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "react-resizable/css/styles.css";
import './App.scss';
import { AlertBar } from './features/alert/AlertBar';
import { CommanderTab } from './features/commander/CommanderTab';
import { Dock } from './features/dock/Dock';
import { TabPosition } from './features/dock/dock-properties';
import { selectBottomDockNonEmpty, selectLeftDockNonEmpty, selectRightDockNonEmpty } from './features/dock/dockSlice';
import { fetchKeithley2636 } from './features/monitor/monitorSlice';
import { fetchAvailableAddresses } from './features/setting/settingSlice';
import { commanderSubsequenceAdded } from './features/subsequence/subsequenceSlice';
import { BottomBar } from './widget/BottomBar';
import { Topbar } from './widget/Topbar';


const useStyles = makeStyles((theme: Theme) => createStyles({
    bodyBox: {
        height: "100vh",
        display: "flex",
        flexDirection: "column",
    },
    mainBox: {
        flexGrow: 1,
        overflowY: "scroll"
    },
    mainLeftRightGrid: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
    },
    mainLeftRightGridColumn: {
        flexGrow: 1,
        overflowY: "auto",
        minHeight: "100%",
        width: "50%",
    },
    mainLeftRightGridTabColumn: {
        height: "100%",
        maxHeight: "100%",
        minHeight: "100%",
        width: "50%"
    },
    rightCell: {
        borderLeft: `thin solid ${theme.palette.text.hint}`,
    },
    leftCell: {
        borderRight: `thin solid ${theme.palette.text.hint}`,
    },
    bottomBox: {
        maxHeight: "100%",
        height: "100%",
        borderTop: `thin solid ${theme.palette.text.hint}`,
        display: "flex",
        flexDirection: "column"
    },
    bottomDiv: {
        borderTop: `thin solid ${theme.palette.text.hint}`,
    },
}));

interface Props {
    paletteType: PaletteType,
    setPaletteType: (type: PaletteType) => void,
}

const AppContent: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const leftDockNonEmpty = useSelector(selectLeftDockNonEmpty);
    const bottomDockNonEmpty = useSelector(selectBottomDockNonEmpty);
    const rightDockNonEmpty = useSelector(selectRightDockNonEmpty);

    const commanderTab = <CommanderTab />;

    /**
     * See https://stackoverflow.com/questions/52409322/material-ui-grid-with-independent-scrolling-columns.
     */

    return (
        <Box className={classes.bodyBox} >
            <Topbar {...props} />
            {(!leftDockNonEmpty && !rightDockNonEmpty) &&
                <Box className={classes.mainBox} >
                    {commanderTab}
                </Box>
            }
            {(leftDockNonEmpty || rightDockNonEmpty) &&
                <Grid container className={classes.mainLeftRightGrid} >
                    <Grid item xs={6} className={clsx(
                        classes.leftCell, {
                            [classes.mainLeftRightGridColumn]: !leftDockNonEmpty,
                            [classes.mainLeftRightGridTabColumn]: leftDockNonEmpty
                        })}
                    >
                        {
                            leftDockNonEmpty && <Dock position={TabPosition.Left} />
                        }
                        {
                            !leftDockNonEmpty && commanderTab
                        }
                    </Grid>
                    <Grid item xs={6} className={clsx(
                        classes.rightCell, {
                            [classes.mainLeftRightGridColumn]: !rightDockNonEmpty,
                            [classes.mainLeftRightGridTabColumn]: rightDockNonEmpty
                        })}
                    >
                        {
                            rightDockNonEmpty && <Dock position={TabPosition.Right} />
                        }
                        {
                            !rightDockNonEmpty && commanderTab
                        }
                    </Grid>
                </Grid>
            }
            {bottomDockNonEmpty &&
                <Dock position={TabPosition.Bottom} />
            }
            <BottomBar />
        </Box>
    );
}

function ThemedApp() {
    const [paletteType, setPaletteType] = useState('dark' as PaletteType);
    const theme = createTheme({
        palette: {
            type: paletteType,
        },
        typography: {
            fontSize: 14,
        },
    });

    return (
        <ThemeProvider theme={theme} >
            <CssBaseline />
            <AppContent {...{ paletteType, setPaletteType }} />
            <AlertBar />
        </ThemeProvider>
    );
}

function App() {
    const dispatch = useDispatch();
    const dispatchMonitor = () => {
        dispatch(fetchKeithley2636());
        setTimeout(dispatchMonitor, 4000);
    };
    const dispatchAddresses = () => {
        dispatch(fetchAvailableAddresses());
        setTimeout(dispatchAddresses, 2000);
    }

    useEffect(() => {
        dispatch(commanderSubsequenceAdded({
            id: nanoid(),
            experiments: []
        }));
        // try to hide the address bar on mobile devices
        window.scrollTo(0, 1000);

        dispatchMonitor();
        dispatchAddresses();
    });

    return <ThemedApp />;
}

export default App;
