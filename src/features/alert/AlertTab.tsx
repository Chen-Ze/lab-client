import { Container, createStyles, makeStyles, Theme, Typography, useTheme } from '@material-ui/core';
import dateFormat from 'dateformat';
import { useSelector } from 'react-redux';
import { DockTabProps } from '../dock/dock-properties';
import { selectAllAlerts } from './alertSlice';


const useStyles = makeStyles((theme: Theme) => createStyles({
    pre: {
        fontFamily: "Courier New, monospace",
        padding: theme.spacing(0, 2),
    },
    noAlerts: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
}));

interface Props extends DockTabProps {

}

export const AlertTab: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const allAlerts = useSelector(selectAllAlerts);

    if (allAlerts.length === 0) {
        return (
            <Container className={classes.noAlerts} >
                <Typography variant="h5" >
                    No Alerts
                </Typography>
            </Container>
        );
    }

    return (
        <pre className={classes.pre} >
            {allAlerts.map((alert) => {
                return `${dateFormat(alert.time, "yyyy/mm/dd/ HH:MM:ss")} - ${alert.message}\n`;
            })}
        </pre>
    );
}