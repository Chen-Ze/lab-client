import { alpha, createStyles, Grid, makeStyles, Theme, useTheme } from "@material-ui/core"
import clsx from "clsx";


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
    selected: 'left' | 'bottom' | 'right',
    onSelection: (selected: 'left' | 'bottom' | 'right') => void
}

export const DockSide: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <Grid container >
            <Grid item >
                <div
                    className={clsx(classes.icon, {
                        [classes.iconSelected]: props.selected === 'left'
                    })}
                    onClick={() => props.onSelection("left")}
                >
                    <div className={clsx(classes.left)} >
                    </div>
                </div>
            </Grid>
            <Grid item >
                <div
                    className={clsx(classes.icon, {
                        [classes.iconSelected]: props.selected === 'bottom'
                    })}
                    onClick={() => props.onSelection("bottom")}
                >
                    <div className={clsx(classes.bottom)} >
                    </div>
                </div>
            </Grid>
            <Grid item >
                <div
                    className={clsx(classes.icon, {
                        [classes.iconSelected]: props.selected === 'right'
                    })}
                    onClick={() => props.onSelection("right")}
                >
                    <div className={clsx(classes.right)} >
                    </div>
                </div>
            </Grid>
        </Grid>
    )
}
