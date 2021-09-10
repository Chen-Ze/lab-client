import { Box, Card, CardContent, createStyles, FormControl, IconButton, makeStyles, TextField, Theme, Typography, useTheme } from "@material-ui/core";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { nanoid } from "@reduxjs/toolkit";
import clsx from "clsx";
import { getRandomNumberRecipeVariables } from "material-science-experiment-recipes/lib/random-number-recipe";
import { useDispatch } from "react-redux";
import { TabAction } from "../../widget/TabAction";
import { TabCollapse } from "../../widget/TabCollapse";
import { VariableTable } from "../../widget/VariableTable";
import { SubsequenceTab } from "../subsequence/SubsequenceTab";
import { ExperimentTabProps } from "../util/props";
import { tabStyles } from "../util/styles";
import { RandomNumberGenerator } from "./generator/RandomNumberGenerator";
import { randomNumberCountChanged, RandomNumberEntity, randomNumberGeneratorAdded, randomNumberGeneratorChanged, randomNumberGeneratorRemoved, randomNumberUpdated, randomNumberVariableChanged } from "./randomNumberSlice";


const useStyles = makeStyles((theme: Theme) => createStyles({
    ...tabStyles(theme),
    input: {
        fontFamily: "Courier New, monospace",
    },
    header: {
        marginBottom: theme.spacing(2)
    },
    headerRow: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        marginBottom: theme.spacing(2)
    },
    generatorBox: {
        margin: theme.spacing(2, 0)
    }
}));

interface Props extends ExperimentTabProps {
    entity: RandomNumberEntity
}

export const RandomNumberTab: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();

    const handleChange = (name: string, value: any) => {
        dispatch(randomNumberUpdated({
            id: props.entity.id,
            name,
            value
        }));
    }

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
            <TabCollapse {...props} >
                <CardContent>
                    <Typography variant="h5" className={classes.header} >
                        Random Number
                    </Typography>
                    <Box className={classes.headerRow} >
                        <FormControl variant="filled">
                            <TextField
                                value={props.entity.recipe.count}
                                onChange={(e) => dispatch(randomNumberCountChanged({
                                    id: props.entity.id,
                                    count: e.target.value
                                }))}
                                label="Count"
                                InputProps={{
                                    className: classes.input
                                }}
                            />
                        </FormControl>
                        <IconButton
                            onClick={(e) => dispatch(randomNumberGeneratorAdded({
                                id: props.entity.id,
                                name: `$${nanoid()}`
                            }))}
                            edge="start"
                        >
                            <AddCircleOutlineIcon color="primary" />
                        </IconButton>
                    </Box>
                    {
                        props.entity.recipe.generators.map((generator, index) => (
                            <Box key={`${index}`} className={classes.generatorBox} >
                                <RandomNumberGenerator
                                    handleChange={(key, value) => dispatch(randomNumberGeneratorChanged({
                                        id: props.entity.id,
                                        index,
                                        key,
                                        value
                                    }))}
                                    remove={() => dispatch(randomNumberGeneratorRemoved({
                                        id: props.entity.id,
                                        index
                                    }))}
                                    {...{ generator }}
                                />
                            </Box>
                        ))
                    }
                    <VariableTable
                        id={props.entity.id}
                        availableVariables={getRandomNumberRecipeVariables(props.entity.recipe)}
                        variableActionCreator={randomNumberVariableChanged}
                        recipe={props.entity.recipe}
                    />
                    <SubsequenceTab id={props.entity.subsequenceId} />
                </CardContent>
                <TabAction
                    {...props}
                    hasCollapse={true}
                    hasEnable={true}
                    handleChange={handleChange}
                />
            </TabCollapse>
        </Card>
    )
}
