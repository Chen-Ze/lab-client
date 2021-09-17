import { Box, Card, CardContent, createStyles, FormControl, Grid, InputAdornment, InputLabel, makeStyles, MenuItem, Select, TextField, Theme, Typography, useTheme } from '@material-ui/core';
import clsx from 'clsx';
import { getKeithley2400SimpleRecipeVariables } from 'material-science-experiment-recipes/lib/keithley-2400-simple-recipe';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { TabAction } from "../../widget/TabAction";
import { TabCollapse } from "../../widget/TabCollapse";
import { VariableTable } from '../../widget/VariableTable';
import { InstrumentPrototype, selectInstrumentsByPrototype } from '../instruments/instrumentsSlice';
import { Channel } from "../keithley-simple/channel/Channel";
import { SubsequenceTab } from '../subsequence/SubsequenceTab';
import { TabAccordion } from '../util/Accordion';
import { ExperimentTabProps } from '../util/props';
import { tabStyles } from '../util/styles';
import { Keithley2400Entity, keithley2400RecipeUpdated, keithley2400SMUModeUpdated, keithley2400SMUUpdated, keithley2400Updated, keithley2400VariableChanged } from './keithley2400Slice';


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
    entity: Keithley2400Entity
}

export const Keithley2400Tab: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();

    const handleChange = (name: string, value: any) => {
        dispatch(keithley2400Updated({
            id: props.entity.id,
            name,
            value
        }));
    };

    const instruments = useSelector((state: RootState) => selectInstrumentsByPrototype(state, InstrumentPrototype.Keithley2400));

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
                        Keithley 2400 Simple
                    </Typography>
                </CardContent>
                <TabAccordion title="Parameters" >
                    <Box className={classes.mainControlBox} >
                        <FormControl className={classes.instrumentInput} variant="outlined" >
                            <InputLabel>Name</InputLabel>
                            <Select
                                value={props.entity.recipe.name}
                                onChange={e => dispatch(keithley2400RecipeUpdated({
                                    id: props.entity.id,
                                    name: "name",
                                    value: String(e.target.value)
                                }))}
                                label="Address"
                                color="primary"
                                error={
                                    !props.entity.recipe.name ||
                                    !instruments.map(({ name }) => name).includes(props.entity.recipe.name)
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
                            onChange={(e) => dispatch(keithley2400RecipeUpdated({
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
                            onChange={(e) => dispatch(keithley2400RecipeUpdated({
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
                        <Grid item xs={12} >
                            <Channel
                                recipe={props.entity.recipe.smuRecipe}
                                setMode={(mode) => dispatch(keithley2400SMUModeUpdated({
                                    id: props.entity.id,
                                    smuMode: mode
                                }))}
                                fixedModeOnly={false}
                                handleChange={(name, value) => dispatch(keithley2400SMUUpdated({
                                    id: props.entity.id,
                                    name,
                                    value
                                }))}
                            />
                        </Grid>
                    </Grid>
                </TabAccordion>
                <TabAccordion title="Measurements" >
                    <VariableTable
                        id={props.entity.id}
                        availableVariables={getKeithley2400SimpleRecipeVariables(props.entity.recipe)}
                        variableActionCreator={keithley2400VariableChanged}
                        recipe={props.entity.recipe}
                    />
                </TabAccordion>
                <TabAccordion title="Subsequence" >
                    <SubsequenceTab id={props.entity.subsequenceId} />
                </TabAccordion>
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