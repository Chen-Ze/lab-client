import { Box, createStyles, createTheme, CssBaseline, Grid, makeStyles, PaletteType, Theme, ThemeProvider, useMediaQuery, useTheme } from '@material-ui/core';
import { nanoid } from '@reduxjs/toolkit';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ResizableBox } from 'react-resizable';
import "react-resizable/css/styles.css";
import './App.scss';
import { CommanderTab } from './features/commander/CommanderTab';
import { fetchKeithley2636 } from './features/monitor/monitorSlice';
import { MonitorTab } from './features/monitor/MonitorTab';
import { commanderSubsequenceAdded } from './features/subsequence/subsequenceSlice';
import { BottomBar } from './widget/BottomBar';
import { DockTopBar } from './widget/DockTopBar';
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
}));

interface Props {
    paletteType: PaletteType,
    setPaletteType: (type: PaletteType) => void,
}

const AppContent: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    type TabPosition = 'left' | 'bottom' | 'right';
    const largeUp = useMediaQuery(theme.breakpoints.up('lg'));

    const [monitorOpen, setMonitorOpen] = useState(false);
    const [monitorPosition, setMonitorPosition] = useState((largeUp ? 'right' : 'bottom') as TabPosition);

    const commanderTab = <CommanderTab />;

    /**
     * See https://stackoverflow.com/questions/52409322/material-ui-grid-with-independent-scrolling-columns.
     */

    return (
        <Box className={classes.bodyBox} >
            <Topbar {...props} />
            {!monitorOpen && <Box className={classes.mainBox} >
                {commanderTab}
            </Box>}
            {monitorOpen && (monitorPosition === 'right') &&
                <Grid container className={classes.mainLeftRightGrid} >
                    <Grid item xs={6} className={classes.mainLeftRightGridColumn} >
                        {
                            commanderTab
                        }
                    </Grid>
                    <Grid item xs={6} className={clsx(
                        classes.mainLeftRightGridColumn,
                        classes.rightCell
                    )} >
                        {
                            <Box >
                                <DockTopBar selected="right" onSelection={setMonitorPosition} onClose={() => setMonitorOpen(false)} />
                                <MonitorTab position="vertical" />
                            </Box>
                        }
                    </Grid>
                </Grid>
            }
            {monitorOpen && (monitorPosition === 'left') &&
                <Grid container className={classes.mainLeftRightGrid} >
                    <Grid item xs={6} className={clsx(
                        classes.mainLeftRightGridColumn,
                        classes.leftCell
                    )} >
                        {
                            <Box >
                                <DockTopBar selected="left" onSelection={setMonitorPosition} onClose={() => setMonitorOpen(false)} />
                                <MonitorTab position="vertical" />
                            </Box>
                        }
                    </Grid>
                    <Grid item xs={6} className={classes.mainLeftRightGridColumn} >
                        {
                            commanderTab
                        }
                    </Grid>
                </Grid>
            }
            {monitorOpen && (monitorPosition === 'bottom') && <Box className={classes.mainBox} >
                {commanderTab}
            </Box>}
            {monitorOpen && (monitorPosition === 'bottom') &&
                <ResizableBox
                    height={0.4 * document.documentElement.clientHeight}
                    width={document.documentElement.clientWidth}
                    maxConstraints={[Infinity, 0.6 * document.documentElement.clientHeight]}
                    axis="y" resizeHandles={["n"]}
                >
                    <Box className={classes.bottomBox} >
                        <DockTopBar selected="bottom" onSelection={setMonitorPosition} onClose={() => setMonitorOpen(false)} />
                        <MonitorTab position="horizontal" />
                    </Box>
                </ResizableBox>
            }
            <BottomBar {...{ monitorOpen, setMonitorOpen }} />
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
        </ThemeProvider>
    );
}

function App() {
    const dispatch = useDispatch();
    const dispatchMonitor = () => {
        dispatch(fetchKeithley2636());
        setTimeout(dispatchMonitor, 4000)
    }
    useEffect(() => {
        dispatch(commanderSubsequenceAdded({
            id: nanoid(),
            experiments: []
        }));
        // try to hide the address bar on mobile devices
        window.scrollTo(0, 1000);

        dispatchMonitor();
    });

    return <ThemedApp />;
}

export default App;
