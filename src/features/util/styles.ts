import { alpha, createStyles, Theme } from "@material-ui/core";

export const tabStyles = (theme: Theme) => createStyles({
    '@keyframes blinker': {
        "0%": { backgroundColor: alpha(theme.palette.background.paper, 0.6) },
        "50%": { backgroundColor: alpha(theme.palette.background.paper, 1) },
        "100%": { backgroundColor: alpha(theme.palette.background.paper, 0.6) },
    },
    plotGridCell: {
        display: "flex",
        justifyContent: "center",
    },
    axisValueGridCell: {
        display: "flex",
        justifyContent: "center",
    },
    axisValueAutoComplete: {
        width: "25ch",
    },
    axisValueAutoCompleteList: {
        fontFamily: "Courier New, monospace",
    },
    axisValueField: {
        fontFamily: "Courier New, monospace",
    },
    measurementCard: {
        position: "relative",
        // borderWidth: "4px",
        // borderColor: alpha(theme.palette.info.light, 0.4),
    },
    measurementCardMeasuring: {
        position: "relative",
        animationName: '$blinker',
        animationDuration: '2s',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
    },
    measurementCardDisabled: {
        position: "relative",
    },
});

