import { Box, createStyles, Grid, makeStyles, Theme, useTheme } from '@material-ui/core';
import React from "react";
import { DockTabProps } from '../dock/dock-properties';
import { selectLastSMUACurrent, selectLastSMUAVoltage, selectLastSMUBCurrent, selectLastSMUBVoltage, selectSMUACurrents, selectSMUAVoltages, selectSMUBCurrents, selectSMUBVoltages } from './monitorSlice';
import { CHART_COLORS, RealtimePlot } from './widget/RealtimePlot';
import { RealtimeTable } from './widget/RealtimeTable';
import { SevenSeg } from './widget/SevenSeg';


const useStylesVertical = makeStyles((theme: Theme) => createStyles({
    monitorTabContainer: {
        padding: theme.spacing(0, 2),
        maxHeight: "100%",
    },
    monitorUnit: {
        [theme.breakpoints.down("sm")]: {
            maxWidth: "100%",
        },
    },
    monitorTabBox: {
    }
}));

const useStylesHorizontal = makeStyles((theme: Theme) => createStyles({
    monitorTabContainer: {
        padding: theme.spacing(0, 2),
        maxHeight: "100%",
        width: "100%",
    },
    monitorUnit: {
        [theme.breakpoints.down("sm")]: {
            maxWidth: "100%",
        },
        [theme.breakpoints.up("lg")]: {
            maxWidth: "45vw",
        },
    },
    monitorTabBox: {
        [theme.breakpoints.up("lg")]: {
            display: "flex",
            justifyContent: "space-around"
        },
    }
}));

interface Props extends DockTabProps {

}

export const MonitorTab: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classesVertical = useStylesVertical(theme);
    const classesHoritontal = useStylesHorizontal(theme);
    const classes = props.position === 'bottom' ? classesHoritontal : classesVertical;

    return (
        <Box className={classes.monitorTabContainer} >
            <Box className={classes.monitorTabBox} >
                <Grid container className={classes.monitorUnit} spacing={2} justifyContent="center" alignItems="center" >
                    <Grid item xs={12} sm={8} >
                        <RealtimePlot
                            label="SMU A Voltage"
                            selector={selectSMUAVoltages}
                            moreLabel="SMU A Current"
                            moreSelector={selectSMUACurrents}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} >
                        <RealtimeTable entries={[
                            {
                                title: "SMU A Voltage",
                                selector: selectLastSMUAVoltage,
                                render: ({ value }) => <SevenSeg color={CHART_COLORS.red.string()} unit={"V"} >{value}</SevenSeg>
                            },
                            {
                                title: "SMU A Current",
                                selector: selectLastSMUACurrent,
                                render: ({ value }) => <SevenSeg color={CHART_COLORS.blue.string()} unit={"A"} >{value}</SevenSeg>
                            }
                        ]}
                        />
                    </Grid>
                </Grid>
                <Grid container className={classes.monitorUnit} spacing={2} justifyContent="center" alignItems="center" >
                    <Grid item xs={12} sm={8} >
                        <RealtimePlot label="SMU B Voltage" selector={selectSMUBVoltages} moreLabel="SMU B Current" moreSelector={selectSMUBCurrents} />
                    </Grid>
                    <Grid item xs={12} sm={4} >
                        <RealtimeTable entries={[
                            {
                                title: "SMU B Voltage",
                                selector: selectLastSMUBVoltage,
                                render: ({ value }) => <SevenSeg color={CHART_COLORS.red.string()} unit={"V"} >{value}</SevenSeg>
                            },
                            {
                                title: "SMU B Current",
                                selector: selectLastSMUBCurrent,
                                render: ({ value }) => <SevenSeg color={CHART_COLORS.blue.string()} unit={"A"} >{value}</SevenSeg>
                            }
                        ]} />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};
