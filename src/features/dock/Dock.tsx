import { Box, createStyles, makeStyles, Theme, useTheme } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { ResizableBox } from "react-resizable";
import { DockTopBar } from "../../widget/DockTopBar";
import { DockProps, DockTabProps, TabName, TabPosition } from "./dock-properties";
import { closeAll, moveTab, openTab, selectBottomDock, selectLeftDock, selectRightDock } from "./dockSlice";
import { DockTab } from "./DockTab";


const useStyles = makeStyles((theme: Theme) => createStyles({
    bottomBox: {
        maxHeight: "100%",
        height: "100%",
        borderTop: `thin solid ${theme.palette.text.hint}`,
        display: "flex",
        flexDirection: "column",
        position: "relative"
    },
    verticalBox: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: "100%",
        minHeight: "100%",
        position: "relative"
    }
}));

function getTabs(currentTabName: TabName, tabNames: TabName[], props: DockTabProps) {
    return (
        <>
            {
                tabNames.map((tabName) => {
                    return (
                        <div key={tabName.toString()} hidden={tabName !== currentTabName}
                            style={{
                                flexGrow: 1,
                                overflowY: "scroll"
                            }}
                        >
                            <DockTab type={tabName} tabProps={props} />
                        </div>
                    );
                })
            }
        </>
    )
}

const LeftDock: React.FC<{}> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const dispatch = useDispatch();
    const leftDock = useSelector(selectLeftDock);

    return (
        <Box className={classes.verticalBox} >
            <DockTopBar
                onTabIndexChange={(newTab) => {
                    dispatch(openTab(newTab))
                }}
                currentTab={leftDock.stack[0]}
                tabLabels={leftDock.all}
                selected={TabPosition.Left}
                onSelection={(selected) => {
                    dispatch(moveTab({
                        tab: leftDock.stack[0],
                        newPosition: selected
                    }))
                }}
                onClose={() => dispatch(closeAll(TabPosition.Left))}
            />
            {
                getTabs(leftDock.stack[0], leftDock.all, {
                    position: TabPosition.Left
                })
            }
        </Box>
    );
}

const BottomDock: React.FC<{}> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const dispatch = useDispatch();
    const bottomDock = useSelector(selectBottomDock);

    return (
        <ResizableBox
            height={0.4 * document.documentElement.clientHeight}
            width={document.documentElement.clientWidth}
            maxConstraints={[Infinity, 0.6 * document.documentElement.clientHeight]}
            axis="y" resizeHandles={["n"]}
        >
            <Box className={classes.bottomBox} >
                <DockTopBar
                    onTabIndexChange={(newTab) => {
                        dispatch(openTab(newTab))
                    }}
                    currentTab={bottomDock.stack[0]}
                    tabLabels={bottomDock.all}
                    selected={TabPosition.Bottom}
                    onSelection={(selected) => {
                        dispatch(moveTab({
                            tab: bottomDock.stack[0],
                            newPosition: selected
                        }))
                    }}
                    onClose={() => dispatch(closeAll(TabPosition.Bottom))}
                />
                {
                    getTabs(bottomDock.stack[0], bottomDock.all, {
                        position: TabPosition.Bottom
                    })
                }
            </Box>
        </ResizableBox>
    );
};

const RightDock: React.FC<{}> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    
    const dispatch = useDispatch();
    const rightDock = useSelector(selectRightDock);

    return (
        <Box className={classes.verticalBox} >
            <DockTopBar
                onTabIndexChange={(newTab) => {
                    dispatch(openTab(newTab))
                }}
                currentTab={rightDock.stack[0]}
                tabLabels={rightDock.all}
                selected={TabPosition.Right}
                onSelection={(selected) => {
                    dispatch(moveTab({
                        tab: rightDock.stack[0],
                        newPosition: selected
                    }))
                }}
                onClose={() => dispatch(closeAll(TabPosition.Right))}
            />
            {
                getTabs(rightDock.stack[0], rightDock.all, {
                    position: TabPosition.Right
                })
            }
        </Box>
    );
}

export const Dock: React.FC<DockProps> = (props) => {
    switch (props.position) {
        case TabPosition.Left:
            return <LeftDock />;
        case TabPosition.Bottom:
            return <BottomDock />;
        case TabPosition.Right:
            return <RightDock />;
    }
}

