import { Container, createStyles, makeStyles, Theme, useTheme } from "@material-ui/core";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { SubsequenceTab } from "../subsequence/SubsequenceTab";
import { selectCommanderSubsequenceId } from "./commanderSlice";


const useStyles = makeStyles((theme: Theme) => createStyles({
    wrapper: {
        display: "flex",
        justifyContent: "center",
        [theme.breakpoints.only('xs')]: {
            maxWidth: "100vw",
        },
        [theme.breakpoints.only('sm')]: {
            maxWidth: "85vw",
        },
        [theme.breakpoints.only('md')]: {
            maxWidth: "75vw",
        },
        [theme.breakpoints.up('lg')]: {
            maxWidth: "65vw",
        },
    },
    sequenceContainer: {
        margin: theme.spacing(2, 'auto'),
    },
}));

interface Props {

}

export const CommanderTab: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const subsequenceId = useSelector(selectCommanderSubsequenceId);
    return (
        <Container className={clsx(classes.wrapper, classes.sequenceContainer)}>
            <SubsequenceTab id={subsequenceId} />
        </Container>
    );
};