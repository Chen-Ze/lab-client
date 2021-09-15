import { Box, Card, CardContent, createStyles, FormControl, Grid, InputAdornment, InputLabel, makeStyles, MenuItem, Select, TextField, Theme, Typography, useTheme } from '@material-ui/core';
import clsx from 'clsx';
import { isSweepChannelRecipe } from 'material-science-experiment-recipes/lib/keithley-simple/smu-recipe';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { TabAction } from "../../widget/TabAction";
import { TabCollapse } from "../../widget/TabCollapse";
import { InstrumentPrototype, selectInstrumentsByPrototype } from '../instruments/instrumentsSlice';
import { SubsequenceTab } from '../subsequence/SubsequenceTab';
import { ExperimentTabProps } from '../util/props';
import { tabStyles } from '../util/styles';
import { Channel } from "../keithley-simple/channel/Channel";
import { Keithley2636Entity, keithley2636RecipeUpdated, keithley2636SMUModeUpdated, keithley2636SMUUpdated, keithley2636Updated, keithley2636VariableChanged } from './keithley2636Slice';
import { getKeithley2636SimpleRecipeVariables } from 'material-science-experiment-recipes/lib/keithley-2636-simple-recipe';
import { VariableTable } from '../../widget/VariableTable';


const useStyles = makeStyles((theme: Theme) => createStyles({
    ...tabStyles(theme),
    instrumentInput: {
        width: "25ch",
        margin: theme.spacing(1)
    },
    input: {
        fontFamily: "Courier New, monospace",
    },
    mainControlBox: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        margin: theme.spacing(2, 0)
    },
    channelGrid: {
        marginBottom: theme.spacing(1)
    }
}));

interface Props extends ExperimentTabProps {
    entity: Keithley2636Entity
}

export const Keithley2636Tab: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();

    const handleChange = (name: string, value: any) => {
        dispatch(keithley2636Updated({
            id: props.entity.id,
            name,
            value
        }));
    };

    const instruments = useSelector((state: RootState) => selectInstrumentsByPrototype(state, InstrumentPrototype.Keithley2600));

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
                    <Typography variant="h5" >
                        Keithley 2600 Simple
                    </Typography>
                    <Box className={classes.mainControlBox} >
                        <FormControl className={classes.instrumentInput} variant="outlined" >
                            <InputLabel>Name</InputLabel>
                            <Select
                                value={props.entity.recipe.name}
                                onChange={e => dispatch(keithley2636RecipeUpdated({
                                    id: props.entity.id,
                                    name: "name",
                                    value: String(e.target.value)
                                }))}
                                label="Address"
                                color="primary"
                                error={
                                    !props.entity.recipe.name ||
                                    !instruments.map(({name}) =>name).includes(props.entity.recipe.name)
                                }
                            >
                                {
                                    instruments.map(({ id, name }) => (
                                        <MenuItem key={id} value={name} >
                                            {name}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <TextField
                            value={props.entity.recipe.wait}
                            onChange={(e) => dispatch(keithley2636RecipeUpdated({
                                id: props.entity.id,
                                name: "wait",
                                value: String(e.target.value)
                            }))}
                            label="Wait"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">ms</InputAdornment>,
                                className: classes.input
                            }}
                            className={classes.instrumentInput}
                        />
                        <TextField
                            value={props.entity.recipe.integrationTime}
                            onChange={(e) => dispatch(keithley2636RecipeUpdated({
                                id: props.entity.id,
                                name: "integrationTime",
                                value: String(e.target.value)
                            }))}
                            label="Integration Time"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">ms</InputAdornment>,
                                className: classes.input
                            }}
                            className={classes.instrumentInput}
                        />
                    </Box>
                    <Grid container spacing={3} justifyContent="center" className={classes.channelGrid} >
                        <Grid item xs={12} md={6} >
                            <Channel
                                title="SMU A"
                                recipe={props.entity.recipe.smuARecipe}
                                setMode={(mode) => dispatch(keithley2636SMUModeUpdated({
                                    id: props.entity.id,
                                    smu: "smuA",
                                    smuMode: mode
                                }))}
                                fixedModeOnly={isSweepChannelRecipe(props.entity.recipe.smuBRecipe)}
                                handleChange={(name, value) => dispatch(keithley2636SMUUpdated({
                                    id: props.entity.id,
                                    smu: "smuA",
                                    name,
                                    value
                                }))}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} >
                            <Channel
                                title="SMU B"
                                recipe={props.entity.recipe.smuBRecipe}
                                setMode={(mode) => dispatch(keithley2636SMUModeUpdated({
                                    id: props.entity.id,
                                    smu: "smuB",
                                    smuMode: mode
                                }))}
                                fixedModeOnly={isSweepChannelRecipe(props.entity.recipe.smuARecipe)}
                                handleChange={(name, value) => dispatch(keithley2636SMUUpdated({
                                    id: props.entity.id,
                                    smu: "smuB",
                                    name,
                                    value
                                }))}
                            />
                        </Grid>
                    </Grid>
                    <VariableTable
                        id={props.entity.id}
                        availableVariables={getKeithley2636SimpleRecipeVariables(props.entity.recipe)}
                        variableActionCreator={keithley2636VariableChanged}
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