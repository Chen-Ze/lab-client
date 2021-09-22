import { Box, makeStyles, TextField, Theme, useTheme, createStyles } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { LightFieldEntity, lightFieldParameterUpdated } from "./lightFieldSlice";


const useStyles = makeStyles((theme: Theme) => createStyles({
    box: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "baseline",
        flexWrap: "wrap"
    },
    payloadInput: {
        width: "100%",
        margin: theme.spacing(1)
    },
    monospace: {
        fontFamily: "Courier New, monospace",
    },
}));

interface Props {
    entity: LightFieldEntity
}

export const LightFieldSaveSpectrumBox: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();

    const directoryEmpty = !props.entity.recipe.payload.directory;
    const prefixEmpty = !props.entity.recipe.payload.prefix;

    return (
        <Box className={classes.box} >
            <TextField
                value={props.entity.recipe.payload.directory}
                onChange={(e) => dispatch(lightFieldParameterUpdated({
                    id: props.entity.id,
                    name: "directory",
                    value: e.target.value
                }))}
                label={"Directory"}
                className={classes.payloadInput}
                InputProps={{
                    className: classes.monospace
                }}
                error={directoryEmpty}
                helperText={directoryEmpty && "Empty directory."}
            />
            <TextField
                value={props.entity.recipe.payload.prefix}
                onChange={(e) => dispatch(lightFieldParameterUpdated({
                    id: props.entity.id,
                    name: "prefix",
                    value: e.target.value
                }))}
                label={"Prefix"}
                className={classes.payloadInput}
                InputProps={{
                    className: classes.monospace
                }}
                error={prefixEmpty}
                helperText={prefixEmpty && "Empty filename prefix."}
            />
        </Box>
    )
}
