import Collapse from "@kunukn/react-collapse"
import { alpha, createStyles, IconButton, makeStyles, Theme, useTheme } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { tabStyles } from "../features/util/styles";


const useStyles = makeStyles((theme: Theme) => createStyles({
    ...tabStyles(theme),
    collapse: {
        position: "relative",
        transition: theme.transitions.create('height', {
            duration: theme.transitions.duration.standard
        }),
        '&::after': {
            transition: theme.transitions.create('opacity', {
                duration: theme.transitions.duration.shortest,
            }),
            pointerEvents: "auto",
            opacity: 0,
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: `linear-gradient(${
                alpha(theme.palette.common.white, 0)
            } 20%, ${
                alpha(theme.palette.background.paper, 0.9)
            } 40%, ${
                alpha(theme.palette.background.paper, 1)
            })`
        },
        '&.--c-collapsed': {
            "&::after": {
                opacity: 1,
            }
        },
        '&.--c-expanded': {
            "&::after": {
                pointerEvents: "none",
            }
        }
    },
    expandMoreWrapper: {
        position: "absolute",
        top: "60px",
        bottom: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
}));

interface Props {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const TabCollapse: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const {open, setOpen} = props;

    return (
        <>
            <Collapse addState className={classes.collapse} isOpen={open} collapseHeight={"180px"} >
            {
                props.children
            }
            </Collapse>
            {!open &&
                <div className={classes.expandMoreWrapper}>
                    <IconButton onClick={(e) => setOpen(true)} >
                        <ExpandMoreIcon />
                    </IconButton>
                </div>
            }
        </>
    )
}
