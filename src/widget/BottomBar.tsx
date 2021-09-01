import { alpha, AppBar, Box, createStyles, Grid, makeStyles, Theme, useTheme } from "@material-ui/core";
import CheckIcon from '@material-ui/icons/Check';
import DvrIcon from '@material-ui/icons/Dvr';



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
    monitor: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.light, 0.5)
        }
    }
}));

interface Props {
    monitorOpen: boolean,
    setMonitorOpen: (monitorOpen: boolean) => void,
}

export const BottomBar: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <AppBar position="relative" className={classes.appBar} >
            <Box className={classes.box} >
                <Grid container spacing={0} alignItems="center" >
                    <Grid item xs={2} sm={1} className={classes.status} >
                        <CheckIcon />
                    </Grid>
                    <Grid item xs={2} sm={1} className={classes.monitor}
                        onClick={(e) => props.setMonitorOpen(!props.monitorOpen)}
                    >
                        <DvrIcon />
                    </Grid>
                </Grid>
            </Box>
        </AppBar>
    );
}
