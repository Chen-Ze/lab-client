import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import { createStyles, withStyles } from '@material-ui/styles';
import { CardContent, makeStyles, Theme, Typography, useTheme } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


export const Accordion = withStyles({
    root: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiAccordion);

export const AccordionSummary = withStyles({
    root: {
        backgroundColor: 'rgba(0, 0, 0, .03)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiAccordionSummary);

export const AccordionDetails = withStyles((theme) => ({
    root: {
        padding: "0",
    },
}))(MuiAccordionDetails);

const useStyles = makeStyles((theme: Theme) => createStyles({
    accordionInCardContent: {
        width: "100%"
    },
    accordionDetails: {
        padding: "0",
    }
}));

interface Props {
    title: string
}

export const TabAccordion: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <Accordion defaultExpanded={true} >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                <Typography variant="h6" >{props.title}</Typography>
            </AccordionSummary>
            <AccordionDetails >
                <CardContent className={classes.accordionInCardContent} >
                    {props.children}
                </CardContent>
            </AccordionDetails>
        </Accordion>
    );
}
