import { AppBar, Box, createStyles, IconButton, makeStyles, Tab, Tabs, Theme, useTheme } from "@material-ui/core";
import { DockSide } from "./DockSide";
import CloseIcon from '@material-ui/icons/Close';
import { TabPosition } from "../features/dock/dock-properties";


const useStyles = makeStyles((theme: Theme) => createStyles({
    row: {
        display: "flex",
        alignItems: "center",
        justifyContent: "start"
    },
    tab: {
        minWidth: "14ch",
    },
    dockSideWrapper: {
        flexGrow: 1,
        minWidth: "9rem"
    },
    barWrapper: {
        flexShrink: 1,
        overflowX: "scroll",
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
        "&::-webkit-scrollbar": {
            display: "none",
        }
    },
}));

interface Props {
    selected: TabPosition,
    onSelection: (selected: TabPosition) => void,
    onClose: () => void,
    currentTab: any,
    tabLabels: string[],
    onTabIndexChange: (value: any) => void
}

export const DockTopBar: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <Box className={classes.row} >
            <IconButton onClick={props.onClose} >
                <CloseIcon color="disabled" />
            </IconButton>
            <Box className={classes.dockSideWrapper} >
                <DockSide {...props} />
            </Box>
            <Box className={classes.barWrapper} >
                <AppBar position="static" color="transparent" >
                    <Tabs
                        value={props.currentTab}
                        onChange={(e, value) => {
                            props.onTabIndexChange(value);
                        }}
                        aria-label="tabs"
                        variant="scrollable"
                        scrollButtons="auto"
                        indicatorColor="primary"
                    >
                        {
                            props.tabLabels.map((label) => (
                                <Tab key={label} value={label} classes={{ root: classes.tab }} label={label} color="hint" />
                            ))
                        }
                    </Tabs>
                </AppBar>
            </Box>
        </Box>
    );
}
