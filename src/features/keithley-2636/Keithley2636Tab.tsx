import { Card, CardContent, createStyles, Grid, makeStyles, Theme, useTheme } from '@material-ui/core';
import clsx from 'clsx';
import { isSweepChannelRecipe } from 'material-science-experiment-recipes/lib/keithley-2636-simple-recipe';
import { useDispatch } from 'react-redux';
import { TabAction } from "../../widget/TabAction";
import { TabCollapse } from "../../widget/TabCollapse";
import { SubsequenceTab } from '../subsequence/SubsequenceTab';
import { ExperimentTabProps } from '../util/props';
import { tabStyles } from '../util/styles';
import { Channel } from "./channel/Channel";
import { Keithley2636Entity, keithley2636SMUModeUpdated, keithley2636SMUUpdated, keithley2636Updated } from './keithley2636Slice';


const useStyles = makeStyles((theme: Theme) => createStyles({
    ...tabStyles(theme),
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
                    <Grid container spacing={3} justifyContent="center" >
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