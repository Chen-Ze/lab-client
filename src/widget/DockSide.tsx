import { alpha, createStyles, Grid, makeStyles, Theme, useTheme } from "@material-ui/core"
import clsx from "clsx";
import { TabPosition } from "../features/dock/dock-properties";


const useStyles = makeStyles((theme: Theme) => createStyles({
    icon: {
        position: "relative",
        width: "2rem",
        height: "1.5rem",
        backgroundColor: alpha(theme.palette.grey[500], 0.5),
        margin: theme.spacing(0.5),
        cursor: "pointer"
    },
    iconSelected: {
        backgroundColor: alpha(theme.palette.primary.main, 0.5),
    },
    left: {
        position: "absolute",
        top: "0.2rem",
        left: "0.2rem",
        right: "1.3rem",
        bottom: "0.2rem",
        backgroundColor: theme.palette.background.default,
    },
    bottom: {
        position: "absolute",
        top: "0.8rem",
        left: "0.2rem",
        right: "0.2rem",
        bottom: "0.2rem",
        backgroundColor: theme.palette.background.default,
    },
    right: {
        position: "absolute",
        top: "0.2rem",
        left: "1.3rem",
        right: "0.2rem",
        bottom: "0.2rem",
        backgroundColor: theme.palette.background.default,
    },
}));

interface Props {
    selected: TabPosition,
    onSelection: (selected: TabPosition) => void
}

export const DockSide: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <Grid container >
            <Grid item >
                <div
                    className={clsx(classes.icon, {
                        [classes.iconSelected]: props.selected === TabPosition.Left
                    })}
                    onClick={() => props.onSelection(TabPosition.Left)}
                >
                    <div className={clsx(classes.left)} >
                    </div>
                </div>
            </Grid>
            <Grid item >
                <div
                    className={clsx(classes.icon, {
                        [classes.iconSelected]: props.selected === TabPosition.Bottom
                    })}
                    onClick={() => props.onSelection(TabPosition.Bottom)}
                >
                    <div className={clsx(classes.bottom)} >
                    </div>
                </div>
            </Grid>
            <Grid item >
                <div
                    className={clsx(classes.icon, {
                        [classes.iconSelected]: props.selected === TabPosition.Right
                    })}
                    onClick={() => props.onSelection(TabPosition.Right)}
                >
                    <div className={clsx(classes.right)} >
                    </div>
                </div>
            </Grid>
        </Grid>
    )
}
