import { Card, CardContent, createStyles, IconButton, makeStyles, Theme, useTheme } from "@material-ui/core";
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import clsx from "clsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { TabAction } from "../../widget/TabAction";
import { ExperimentTabProps } from "../util/props";
import { tabStyles } from "../util/styles";
import { PauseEntity, pauseUpdated } from "./pauseSlice";


const useStyles = makeStyles((theme: Theme) => createStyles({
    ...tabStyles(theme),
    playButton: {
        display: "flex",
        justifyContent: "center",
    },
    playButtonIcon: {
        fontSize: "4rem",
    }
}));

interface Props extends ExperimentTabProps {
    entity: PauseEntity
}

export const PauseTab: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();

    const handleChange = (name: string, value: any) => {
        dispatch(pauseUpdated({
            id: props.entity.id,
            name,
            value
        }));
    }

    const { setOpen } = props;

    useEffect(() => {
        setOpen(false);
    });

    return (
        <Card className={
            clsx({
                [classes.measurementCardMeasuring]: props.entity.measuring,
                [classes.measurementCardDisabled]: !props.entity.enabled,
                [classes.measurementCard]: !props.entity.measuring && props.entity.enabled,
            })
        }
            variant="outlined"
        >
            <CardContent>
                <div className={classes.playButton} >
                    <IconButton onClick={() => { }} >
                        <PlayCircleOutlineIcon color="primary" className={classes.playButtonIcon} />
                    </IconButton>
                </div>
            </CardContent>
            <TabAction
                {...props}
                hasCollapse={false}
                hasEnable={true}
                handleChange={handleChange}
            />
        </Card>
    )
}
