import { Box, createStyles, IconButton, makeStyles, Theme, useTheme } from "@material-ui/core";
import { EntityId } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { TimeStampedValue } from "./Monitors";
import { RealtimePlot } from "./widget/RealtimePlot";
import { Entry, RealtimeTable } from "./widget/RealtimeTable";
import DeleteIcon from '@material-ui/icons/Delete';
import { monitorRemoved } from "./monitorSlice";
import { useDispatch } from "react-redux";
import { cancelImmediateIntercal } from "../util/util";


const useStyles = makeStyles((theme: Theme) => createStyles({
    monitorUnit: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        alignItems: "center",
        maxWidth: "100%",
        position: "relative"
    },
    realtimePlot: {
        width: "480px",
        maxWidth: "100%",
        margin: theme.spacing(1)
    },
    realtimeTable: {
        width: "180px",
        maxWidth: "100%",
        flexShrink: 1,
        margin: theme.spacing(1)
    },
    removeIcon: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2)
    }
}));

interface Props {
    plotLabel: string,
    plotSelector: (state: RootState) => TimeStampedValue<number>[],
    plotMoreLabel?: string,
    plotMoreSelector?: (state: RootState) => TimeStampedValue<number>[],
    entries: Entry<any>[],
    title?: string,
    id: EntityId
}

export const MonitorUnit: React.FC<Props> = (props: Props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const dispatch = useDispatch();

    return (
        <Box className={classes.monitorUnit} >
            <Box className={classes.realtimePlot} >
                <RealtimePlot
                    label={props.plotLabel}
                    selector={props.plotSelector}
                    moreLabel={props.plotMoreLabel}
                    moreSelector={props.plotMoreSelector}
                    title={props.title}
                />
            </Box>
            <Box className={classes.realtimeTable} >
                <RealtimeTable entries={props.entries} />
            </Box>
            <IconButton
                onClick={() => {
                    dispatch(monitorRemoved(props.id));
                    cancelImmediateIntercal(String(props.id));
                }}
                className={classes.removeIcon}
            >
                <DeleteIcon color="error" fontSize="small" />
            </IconButton>
        </Box>
    );
}
