import { CardActions, createStyles, FormControlLabel, IconButton, makeStyles, Switch, Theme, Tooltip, useTheme } from "@material-ui/core"
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { ExperimentTabProps } from "../features/util/props";


const useStyles = makeStyles((theme: Theme) => createStyles({
    actions: {
        [theme.breakpoints.up('sm')]: {
            justifyContent: "flex-end",
        },
        [theme.breakpoints.down('xs')]: {
            justifyContent: "center",
        },
    },
    cardActionsLeft: {
        flexGrow: 1,
        justifyContent: "flex-start",
    },
}));

interface Props extends ExperimentTabProps {
    hasCollapse: boolean,
    hasEnable: boolean,
    handleChange: (name: string, value: any) => void,
}

export const TabAction: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <CardActions disableSpacing classes={{ root: classes.actions }}>
            {props.hasCollapse && <div className={classes.cardActionsLeft}>
                <IconButton onClick={(e) => { props.setOpen(false); e.stopPropagation(); }} >
                    <ExpandLessIcon fontSize="small" />
                </IconButton>
            </div>}
            {props.hasEnable && <Tooltip title="Execute when the main execution button is clicked." aria-label="add">
                <FormControlLabel
                    control={
                        <Switch
                            name="enabled"
                            checked={props.entity.enabled}
                            onChange={e => props.handleChange("enabled", e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Enabled"
                />
            </Tooltip>}
            <IconButton onClick={props.remove} >
                <DeleteIcon color="error" fontSize="small" />
            </IconButton>
        </CardActions>
    )
}
