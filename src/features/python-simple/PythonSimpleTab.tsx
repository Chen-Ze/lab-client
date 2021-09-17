import { Card, CardContent, createStyles, makeStyles, TextField, Theme, Typography, useTheme } from '@material-ui/core';
import clsx from 'clsx';
import { getPythonSimpleRecipeVariables } from 'material-science-experiment-recipes/lib/python-simple-recipe';
import { useDispatch } from 'react-redux';
import { TabAction } from "../../widget/TabAction";
import { TabCollapse } from "../../widget/TabCollapse";
import { VariableTable } from '../../widget/VariableTable';
import { SubsequenceTab } from '../subsequence/SubsequenceTab';
import { TabAccordion } from '../util/Accordion';
import { ExperimentTabProps } from '../util/props';
import { tabStyles } from '../util/styles';
import { PythonSimpleEntity, pythonSimpleParameterUpdated, pythonSimpleUpdated, pythonSimpleVariableChanged } from './pythonSimpleSlice';


const useStyles = makeStyles((theme: Theme) => createStyles({
    ...tabStyles(theme),
    commandInput: {
        width: "100%",
    },
    monospace: {
        fontFamily: "Courier New, monospace",
    },
}));

interface Props extends ExperimentTabProps {
    entity: PythonSimpleEntity
}

export const PythonSimpleTab: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();

    const handleChange = (name: string, value: any) => {
        dispatch(pythonSimpleUpdated({
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
                        Python
                    </Typography>
                </CardContent>
                <TabAccordion title="Parameters" >
                    <TextField
                        value={props.entity.recipe.command}
                        onChange={(e) => dispatch(pythonSimpleParameterUpdated({
                            id: props.entity.id,
                            name: "command",
                            value: e.target.value
                        }))}
                        label={"Command"}
                        className={classes.commandInput}
                        InputProps={{
                            className: classes.monospace
                        }}
                    />
                </TabAccordion>
                <TabAccordion title="Measurements" >
                    <VariableTable
                        id={props.entity.id}
                        availableVariables={getPythonSimpleRecipeVariables(props.entity.recipe)}
                        variableActionCreator={pythonSimpleVariableChanged}
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