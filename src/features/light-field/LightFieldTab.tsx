import { Box, Card, CardContent, createStyles, FormControl, InputLabel, makeStyles, MenuItem, Select, Theme, Typography, useTheme } from '@material-ui/core';
import clsx from 'clsx';
import { getLightFieldRecipeVariables, LightFieldTask } from 'material-science-experiment-recipes/lib/lightfield-recipe';
import { useDispatch } from 'react-redux';
import { TabAction } from "../../widget/TabAction";
import { TabCollapse } from "../../widget/TabCollapse";
import { VariableTable } from '../../widget/VariableTable';
import { SubsequenceTab } from '../subsequence/SubsequenceTab';
import { TabAccordion } from '../util/Accordion';
import { ExperimentTabProps } from '../util/props';
import { tabStyles } from '../util/styles';
import { LightFieldSaveSpectrumBox } from './LightFieldSaveSpectrumBox';
import { LightFieldEntity, lightFieldTaskUpdated, lightFieldUpdated, lightFieldVariableChanged } from './lightFieldSlice';


const useStyles = makeStyles((theme: Theme) => createStyles({
    ...tabStyles(theme),
    box: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    select: {
        width: "25ch",
    },
    commandInput: {
        width: "100%",
    },
    monospace: {
        fontFamily: "Courier New, monospace",
    },
}));

interface Props extends ExperimentTabProps {
    entity: LightFieldEntity
}

export const LightFieldTab: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();

    const handleChange = (name: string, value: any) => {
        dispatch(lightFieldUpdated({
            id: props.entity.id,
            name,
            value
        }));
    };

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
                        LightField
                    </Typography>
                </CardContent>
                <TabAccordion title="Parameters" >
                    <Box className={classes.box} >
                        <FormControl className={classes.select} variant="outlined">
                            <InputLabel>Mode</InputLabel>
                            <Select
                                value={props.entity.recipe.task}
                                onChange={e => {
                                    dispatch(lightFieldTaskUpdated({
                                        id: props.entity.id,
                                        task: e.target.value as LightFieldTask
                                    }));
                                }}
                                label="Mode"
                            >
                                {
                                    Object.values(LightFieldTask).map((value) => (
                                        <MenuItem key={value} value={value}>{value}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Box>
                </TabAccordion>
                <TabAccordion title="Measurements" >
                    <VariableTable
                        id={props.entity.id}
                        availableVariables={getLightFieldRecipeVariables(props.entity.recipe)}
                        variableActionCreator={lightFieldVariableChanged}
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