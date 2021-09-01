import { createStyles, Grid, makeStyles, Theme, Typography, useTheme } from "@material-ui/core"
import { EntityId } from "@reduxjs/toolkit"
import { useState } from "react"
import { DragDropContext, Draggable, DraggableProvided, DraggableStateSnapshot, Droppable, DropResult } from "react-beautiful-dnd"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../app/store"
import { isKeithley2636Entity } from "../keithley-2636/keithley2636Slice"
import { Keithley2636Tab } from "../keithley-2636/Keithley2636Tab"
import { isPauseEntity } from "../pause/pauseSlice"
import { PauseTab } from "../pause/PauseTab"
import { selectExperimentsByIds } from "../util/selector"
import { ExperimentEntity, experimentRemoved, selectSubsequenceById, subsequenceReordered } from "./subsequenceSlice"

import { AddExperiment } from "./widget/AddExperiment"

const useStyles = makeStyles((theme: Theme) => createStyles({
    draggableList: {
        width: "100%",
    }
}));

export interface Props {
    id: EntityId
}

interface DraggableExperimentProps extends Props {
    experiment: ExperimentEntity,
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot
}

const DraggableExperiment: React.FC<DraggableExperimentProps> = ({
    provided,
    snapshot,
    id,
    experiment
}) => {
    const dispatch = useDispatch();
    const theme = useTheme();

    const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: "none",
        padding: theme.spacing(1, 0),

        // styles we need to apply on draggables
        ...draggableStyle
    });

    const [open, setOpen] = useState(true);

    return (
        <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...(!open ? provided.dragHandleProps : { })}
            style={getItemStyle(
                snapshot.isDragging,
                provided.draggableProps.style
            )}
        >
            {isPauseEntity(experiment) &&
                <PauseTab
                    remove={() => dispatch(experimentRemoved({
                        subsequenceId: id,
                        experimentId: experiment.id
                    }))}
                    open={open}
                    setOpen={setOpen}
                    entity={experiment}
                />
            }
            {isKeithley2636Entity(experiment) &&
                <Keithley2636Tab
                    remove={() => dispatch(experimentRemoved({
                        subsequenceId: id,
                        experimentId: experiment.id
                    }))}
                    open={open}
                    setOpen={setOpen}
                    entity={experiment}
                />
            }
            <div {...provided.dragHandleProps}></div>
        </div>
    );
}

export const SubsequenceTab: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();

    const subsequence = useSelector((state: RootState) => selectSubsequenceById(state, props.id));
    const experiments = useSelector((state: RootState) => selectExperimentsByIds(state, subsequence?.experiments));

    function onDragEnd(result: DropResult) {
        if (!result.destination) {
            return;
        }

        dispatch(subsequenceReordered({
            subsequenceId: props.id,
            startIndex: result.source.index,
            endIndex: result.destination.index
        }));
    }

    if (!subsequence) {
        return (
            <Typography color="error" >
                Invalid Subsequence Id
            </Typography>
        )
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} >
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={classes.draggableList}
                            >
                                {
                                    experiments?.map((experiment, index) =>
                                        experiment &&
                                        <Draggable key={experiment.id} draggableId={String(experiment.id)} index={index} >
                                            {
                                                (provided, snapshot) =>
                                                    <DraggableExperiment
                                                        provided={provided}
                                                        snapshot={snapshot}
                                                        experiment={experiment}
                                                        id={props.id}
                                                    />
                                            }
                                        </Draggable>
                                    )
                                }
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </Grid>
            <Grid item xs={12} >
                <AddExperiment {...props} />
            </Grid>
        </Grid>
    )
}
