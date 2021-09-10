import { alpha, AppBar, Box, createStyles, Grid, makeStyles, Theme, Tooltip, useTheme } from "@material-ui/core";
import CheckIcon from '@material-ui/icons/Check';
import DvrIcon from '@material-ui/icons/Dvr';
import TableChartIcon from '@material-ui/icons/TableChart';
import CodeIcon from '@material-ui/icons/Code';
import TimelineIcon from '@material-ui/icons/Timeline';
import WarningIcon from '@material-ui/icons/Warning';
import { useDispatch } from "react-redux";
import { toggleTab } from "../features/dock/dockSlice";
import { TabName } from "../features/dock/dock-properties";


const useStyles = makeStyles((theme: Theme) => createStyles({
    appBar: {
        backgroundColor: theme.palette.primary.main
    },
    box: {
        [theme.breakpoints.only('xs')]: {
            width: "80%",
        },
        [theme.breakpoints.only('sm')]: {
            width: "80%",
        },
        [theme.breakpoints.only('md')]: {
            width: "60%",
        },
        [theme.breakpoints.up('lg')]: {
            width: "40%",
        }
    },
    status: {
        backgroundColor: theme.palette.success.dark,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    iconWrapper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.light, 0.5)
        }
    }
}));

interface Props {
}

export const BottomBar: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const dispatch = useDispatch();

    return (
        <AppBar position="relative" className={classes.appBar} >
            <Box className={classes.box} >
                <Grid container spacing={0} alignItems="center" >
                    <Tooltip title="Connected Successfully" aria-label="connected successfully">
                        <Grid item xs={2} sm={1} className={classes.status} >
                            <CheckIcon />
                        </Grid>
                    </Tooltip>
                    <Tooltip title="Monitor" aria-label="monitor">
                        <Grid item xs={2} sm={1} className={classes.iconWrapper}
                            onClick={(e) => dispatch(toggleTab(TabName.Monitor))}
                        >
                            <DvrIcon />
                        </Grid>
                    </Tooltip>
                    <Tooltip title="Data" aria-label="data">
                        <Grid item xs={2} sm={1} className={classes.iconWrapper}
                            onClick={(e) => dispatch(toggleTab(TabName.Data))}
                        >
                            <TableChartIcon />

                        </Grid>
                    </Tooltip>
                    <Tooltip title="Plots" aria-label="plot">
                        <Grid item xs={2} sm={1} className={classes.iconWrapper}
                            onClick={(e) => dispatch(toggleTab(TabName.Plot))}
                        >
                            <TimelineIcon />
                        </Grid>
                    </Tooltip>
                    <Tooltip title="Sequence" aria-label="sequence">
                        <Grid item xs={2} sm={1} className={classes.iconWrapper}
                            onClick={(e) => dispatch(toggleTab(TabName.Sequence))}
                        >
                            <CodeIcon />
                        </Grid>
                    </Tooltip>
                    <Tooltip title="Alerts" aria-label="alert">
                        <Grid item xs={2} sm={1} className={classes.iconWrapper}
                            onClick={(e) => dispatch(toggleTab(TabName.Alert))}
                        >
                            <WarningIcon />
                        </Grid>
                    </Tooltip>
                </Grid>
            </Box>
        </AppBar>
    );
}
