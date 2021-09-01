import { createStyles, IconButton, makeStyles, Theme, useTheme } from "@material-ui/core";
import { DockSide } from "./DockSide";
import CloseIcon from '@material-ui/icons/Close';


const useStyles = makeStyles((theme: Theme) => createStyles({
    row: {
        display: "flex",
        alignItems: "center",
        justifyContent: "start"
    }
}));

interface Props {
    selected: 'left' | 'bottom' | 'right',
    onSelection: (selected: 'left' | 'bottom' | 'right') => void,
    onClose: () => void
}

export const DockTopBar: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <div className={classes.row} >
            <IconButton onClick={props.onClose} >
                <CloseIcon color="disabled" />
            </IconButton>
            <DockSide {...props} />
        </div>
    );
}
