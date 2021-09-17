import { Box, createStyles, FormControl, IconButton, InputAdornment, InputLabel, makeStyles, MenuItem, Select, TextField, Theme, useTheme } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { nanoid } from '@reduxjs/toolkit';
import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { DockTabProps } from '../dock/dock-properties';
import { selectSetting } from '../setting/settingSlice';
import { setImmediateInterval } from '../util/util';
import { defaultKeithley2400SMUResponse, defaultKeithley2600SMUAResponse, defaultKeithley2600SMUBResponse, isKeithley2400SMUMonitorResponse, isKeithley2600SMUAMonitorResponse, isKeithley2600SMUBMonitorResponse, MonitorPrototype } from './Monitors';
import { createMonitorEntity, fetchMonitor, monitorAdded, selectAllMonitorIdsTitlesAndPrototypes, selectLastResponse, selectResponses } from './monitorSlice';
import { MonitorUnit } from './MonitorUnit';
import { CHART_COLORS } from './widget/RealtimePlot';
import { makeRealtimeTableEntry } from './widget/RealtimeTable';
import { SevenSeg } from './widget/SevenSeg';


const DEFAULT_DELAY = "4000";

const commonStyles = (theme: Theme) => createStyles({
    addMonitorBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        margin: theme.spacing(1)
    },
    monitorControlBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
    },
    monitorInput: {
        width: "25ch",
        margin: theme.spacing(1)
    },
    addIconBox: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    monospace: {
        fontFamily: "Courier New, monospace",
    },
    addButton: {
        margin: theme.spacing(1)
    },
});

const useStylesVertical = makeStyles((theme: Theme) => createStyles({
    ...commonStyles(theme),
    monitorTabContainer: {
        padding: theme.spacing(0, 2),
        maxHeight: "100%",
    },
    monitorTabBox: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around"
    }
}));

const useStylesHorizontal = makeStyles((theme: Theme) => createStyles({
    ...commonStyles(theme),
    monitorTabContainer: {
        padding: theme.spacing(0, 2),
        maxHeight: "100%",
        width: "100%",
    },
    monitorTabBox: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around"
    },
}));

interface Props extends DockTabProps {

}

export const MonitorTab: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classesVertical = useStylesVertical(theme);
    const classesHoritontal = useStylesHorizontal(theme);
    const classes = props.position === 'bottom' ? classesHoritontal : classesVertical;

    const dispatch = useDispatch();

    const monitorIdsAndPrototypes = useSelector(selectAllMonitorIdsTitlesAndPrototypes);

    const setting = useSelector(selectSetting);
    const [title, setTitle] = useState('');
    const [delay, setDelay] = useState(DEFAULT_DELAY);
    const [address, setAddress] = useState('');
    const [monitorPrototype, setMonitorPrototype] = useState('');

    return (
        <Box className={classes.monitorTabContainer} >
            <Box className={classes.addMonitorBox} >
                <Box className={classes.monitorControlBox} >
                    <FormControl className={classes.monitorInput} variant="outlined" >
                        <TextField
                            variant="outlined"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            label="Title"
                            color="primary"
                        />
                    </FormControl>
                    <FormControl className={classes.monitorInput} variant="outlined" >
                        <TextField
                            variant="outlined"
                            value={delay}
                            onChange={e => setDelay(e.target.value)}
                            label="Delay"
                            color="primary"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">ms</InputAdornment>,
                            }}
                        />
                    </FormControl>
                    <FormControl className={classes.monitorInput} variant="outlined" >
                        <InputLabel>Address</InputLabel>
                        <Select
                            value={address}
                            onChange={e => setAddress(String(e.target.value))}
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
                    <FormControl className={classes.monitorInput} variant="outlined" >
                        <InputLabel>Prototype</InputLabel>
                        <Select
                            value={monitorPrototype}
                            onChange={e => setMonitorPrototype(String(e.target.value))}
                            label="Prototype"
                            color="primary"
                        >
                            {
                                Object.values(MonitorPrototype).map(type => (
                                    <MenuItem key={type} value={type} >
                                        {type}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>
                <Box className={classes.addIconBox} >
                    <IconButton
                        onClick={(e) => {
                            if (!title || !delay || !address || !monitorPrototype) return;
                            const delayParsed = Number(delay);
                            if (!delayParsed) return;
                            const id = nanoid();
                            const monitorEntity = createMonitorEntity(
                                monitorPrototype as MonitorPrototype,
                                title,
                                delayParsed,
                                address,
                                id,
                            );
                            dispatch(monitorAdded(monitorEntity));
                            setImmediateInterval(() => dispatch(fetchMonitor({
                                id,
                                monitorPrototype: monitorPrototype as MonitorPrototype,
                                address
                            })), delayParsed, id);
                            setTitle('');
                            setAddress('');
                            setMonitorPrototype('');
                        }}
                        className={classes.addButton}
                    >
                        <AddCircleOutlineIcon color="primary" />
                    </IconButton>
                </Box>
            </Box>
            <Box className={classes.monitorTabBox} >
                {
                    monitorIdsAndPrototypes.map(({ id, prototype, title }) => (
                        <React.Fragment key={id} >
                            {prototype === MonitorPrototype.Keithley2600SMUA &&
                                <MonitorUnit
                                    key={id}
                                    id={id}
                                    title={title}
                                    plotLabel="SMU A Voltage"
                                    plotSelector={(state: RootState) =>
                                        selectResponses(
                                            state, id
                                        )?.filter(
                                            isKeithley2600SMUAMonitorResponse
                                        ).map(
                                            response => response.smuAVoltage
                                        ) || []
                                    }
                                    plotMoreLabel="SMU A Current"
                                    plotMoreSelector={(state: RootState) =>
                                        selectResponses(
                                            state, id
                                        )?.filter(
                                            isKeithley2600SMUAMonitorResponse
                                        ).map(
                                            response => response.smuACurrent
                                        ) || []
                                    }
                                    plotTickFormat={(val) => val.toExponential(3)}
                                    plotMoreTickFormat={(val) => val.toExponential(3)}
                                    entries={[
                                        makeRealtimeTableEntry({
                                            title: "SMU A Voltage",
                                            selector: ((state: RootState) => {
                                                const last = selectLastResponse(state, id);
                                                if (!last || !isKeithley2600SMUAMonitorResponse(last)) {
                                                    return defaultKeithley2600SMUAResponse(id).smuAVoltage;
                                                } else return last.smuAVoltage;
                                            }),
                                            render: (value) => <SevenSeg color={CHART_COLORS.red.string()} unit={"V"} >{value}</SevenSeg>
                                        }),
                                        makeRealtimeTableEntry({
                                            title: "SMU A Current",
                                            selector: ((state: RootState) => {
                                                const last = selectLastResponse(state, id);
                                                if (!last || !isKeithley2600SMUAMonitorResponse(last)) {
                                                    return defaultKeithley2600SMUAResponse(id).smuACurrent;
                                                } else return last.smuACurrent;
                                            }),
                                            render: (value) => <SevenSeg color={CHART_COLORS.blue.string()} unit={"A"} >{value}</SevenSeg>
                                        }),
                                    ]}
                                />
                            }
                            {prototype === MonitorPrototype.Keithley2600SMUB &&
                                <MonitorUnit
                                    key={id}
                                    id={id}
                                    title={title}
                                    plotLabel="SMU B Voltage"
                                    plotSelector={(state: RootState) =>
                                        selectResponses(
                                            state, id
                                        )?.filter(
                                            isKeithley2600SMUBMonitorResponse
                                        ).map(
                                            response => response.smuBVoltage
                                        ) || []
                                    }
                                    plotMoreLabel="SMU B Current"
                                    plotMoreSelector={(state: RootState) =>
                                        selectResponses(
                                            state, id
                                        )?.filter(
                                            isKeithley2600SMUBMonitorResponse
                                        ).map(
                                            response => response.smuBCurrent
                                        ) || []
                                    }
                                    plotTickFormat={(val) => val.toExponential(3)}
                                    plotMoreTickFormat={(val) => val.toExponential(3)}
                                    entries={[
                                        makeRealtimeTableEntry({
                                            title: "SMU B Voltage",
                                            selector: ((state: RootState) => {
                                                const last = selectLastResponse(state, id);
                                                if (!last || !isKeithley2600SMUBMonitorResponse(last)) {
                                                    return defaultKeithley2600SMUBResponse(id).smuBVoltage;
                                                } else return last.smuBVoltage;
                                            }),
                                            render: (value) => <SevenSeg color={CHART_COLORS.red.string()} unit={"V"} >{value}</SevenSeg>
                                        }),
                                        makeRealtimeTableEntry({
                                            title: "SMU B Current",
                                            selector: ((state: RootState) => {
                                                const last = selectLastResponse(state, id);
                                                if (!last || !isKeithley2600SMUBMonitorResponse(last)) {
                                                    return defaultKeithley2600SMUBResponse(id).smuBCurrent;
                                                } else return last.smuBCurrent;
                                            }),
                                            render: (value) => <SevenSeg color={CHART_COLORS.blue.string()} unit={"A"} >{value}</SevenSeg>
                                        }),
                                    ]}
                                />
                            }
                            {prototype === MonitorPrototype.Keithley2400SMU &&
                                <MonitorUnit
                                    key={id}
                                    id={id}
                                    title={title}
                                    plotLabel="Voltage"
                                    plotSelector={(state: RootState) =>
                                        selectResponses(
                                            state, id
                                        )?.filter(
                                            isKeithley2400SMUMonitorResponse
                                        ).map(
                                            response => response.smuVoltage
                                        ) || []
                                    }
                                    plotMoreLabel="Current"
                                    plotMoreSelector={(state: RootState) =>
                                        selectResponses(
                                            state, id
                                        )?.filter(
                                            isKeithley2400SMUMonitorResponse
                                        ).map(
                                            response => response.smuCurrent
                                        ) || []
                                    }
                                    plotTickFormat={(val) => val.toExponential(3)}
                                    plotMoreTickFormat={(val) => val.toExponential(3)}
                                    entries={[
                                        makeRealtimeTableEntry({
                                            title: "Voltage",
                                            selector: ((state: RootState) => {
                                                const last = selectLastResponse(state, id);
                                                if (!last || !isKeithley2400SMUMonitorResponse(last)) {
                                                    return defaultKeithley2400SMUResponse(id).smuVoltage;
                                                } else return last.smuVoltage;
                                            }),
                                            render: (value) => <SevenSeg color={CHART_COLORS.red.string()} unit={"V"} >{value}</SevenSeg>
                                        }),
                                        makeRealtimeTableEntry({
                                            title: "Current",
                                            selector: ((state: RootState) => {
                                                const last = selectLastResponse(state, id);
                                                if (!last || !isKeithley2400SMUMonitorResponse(last)) {
                                                    return defaultKeithley2400SMUResponse(id).smuCurrent;
                                                } else return last.smuCurrent;
                                            }),
                                            render: (value) => <SevenSeg color={CHART_COLORS.blue.string()} unit={"A"} >{value}</SevenSeg>
                                        }),
                                    ]}
                                />
                            }
                        </React.Fragment>
                    ))
                }
            </Box>
        </Box>
    );
};
