This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## To Add Something

### Naming Conventions

The filenames currently follow the following conventions:
1. React components: `FooBar.ts`;
2. Redux slices: `fooBar.ts`;
3. Otherwise: `foo-bar.ts`.

### Add a New Experiment

1. Add a new directory under `/src/features`, with the name `new-experiment`.
2. Add a redux slice file under `/src/features/new-experiment`, with the name `newExperimentSlice.ts`.
3. Make sure that the recipe for the new experiment is ready in `material-science-experiment-recipe`.
4. Write and export in `newExperimentSlice.ts` at least the following:
    ```TypeScript
    import { Action, createEntityAdapter, createSlice, EntityId, nanoid, PayloadAction } from "@reduxjs/toolkit";
    import { defaultNewExperimentRecipe, NewExperimentRecipe } from "material-science-experiment-recipes/lib/new-experiment-recipe"
    import { Recipe } from "material-science-experiment-recipes/lib/recipe";
    import { Dispatch } from "react";
    import { RootState } from "../../app/store";
    import { sequenceImported } from "../sequence/sequenceSlice";
    import { experimentAdded, ExperimentAddedPayload, ExperimentEntity, subsequenceAdded } from "../subsequence/subsequenceSlice";
    import { handleVariableAction, VariablePayload } from "../util/variable";

    export interface NewExperimentEntity extends ExperimentEntity<NewExperimentRecipe> {
        type: 'NewExperiment',
        subsequenceId: EntityId // remove this line if the new experiment has no children
    }

    export function isNewExperimentEntity(entity: ExperimentEntity<Recipe>): entity is NewExperimentEntity {
        return entity.type === 'NewExperiment';
    }

    export function defaultNewExperimentEntity(subsequenceId?: EntityId, id?: EntityId): NewExperimentEntity {
        if (!id) id = nanoid();
        if (!subsequenceId) subsequenceId = nanoid();
        return {
            type: 'NewExperiment',
            id,
            enabled: true,
            measuring: false,
            recipe: defaultNewExperimentRecipe(),
            subsequenceId
        };
    }

    const newExperimentAdapter = createEntityAdapter<NewExperimentEntity>();

    const initialState = newExperimentAdapter.getInitialState();

    export type NewExperimentState = typeof initialState;

    interface NewExperimentUpdatedPayload {
        id: EntityId,
        name: string,
        value: any
    }

    const newExperimentSlice = createSlice({
        name: "newExperiment",
        initialState,
        reducers: {
            /* your own reducers */
            newExperimentUpdated: (state, action: PayloadAction<NewExperimentUpdatedPayload>) => {
                const {id, name, value} = action.payload;
                newExperimentAdapter.updateOne(state, {
                    id,
                    changes: {
                        [name]: value
                    }
                });
            },
            newExperimentVariableChanged: (state, action: PayloadAction<VariablePayload>) => {
                handleVariableAction(state.entities[action.payload.id]?.recipe, action);
            }
        },
        extraReducers: (builder) => {
            builder.addCase(experimentAdded, (state, { payload: { experimentEntity } }) => {
                if (isNewExperiment(experimentEntity)) {
                    newExperimentAdapter.addOne(state, experimentEntity);
                }
            }).addCase(sequenceImported, (state, {payload}) => {
                return payload.newExperiment;
            });
        }
    });

    interface NewExperimentAddedPayload extends ExperimentAddedPayload<NewExperimentRecipe> {
        experimentEntity: NewExperimentEntity
    }

    export const newExperimentAddedCreator = (payload: NewExperimentAddedPayload) => (dispatch: Dispatch<Action<any>>) => {
        // remove the first dispatch if the new experiment has no chilren
        dispatch(subsequenceAdded({
            id: payload.experimentEntity.subsequenceId,
            experiments: []
        }));
        dispatch(experimentAdded({
            subsequenceId: payload.subsequenceId, // remove the subsequenceId entry if the new experiment has no chilren
            experimentEntity: payload.experimentEntity
        }));
    }

    export const {
        /* your own actions */
        newExperimentUpdated,
        newExperimentVariableChanged
    } = newExperimentSlice.actions;

    export default newExperimentSlice.reducer;

    const newExperimentSelectors = newExperimentAdapter.getSelectors((state: RootState) => state.newExperiment);
    export const {
        selectById: selectNewExperimentById,
    } = newExperimentSelectors;
    ```
5. Modify `/src/app/store.ts`:
    1. Add the following import on the top:
    ```TypeScript
    import newExperimentReducer from '../features/new-experiment/newExperimentSlice';
    ```
    2. Add an entry to `store`, like
    ```TypeScript
    export const store = configureStore({
        reducer: {
            /* previous reducers */
            newExperiment: newExperimentReducer,
        },
    });
    ```
6. Modify `/src/features/sequence/sequenceSlice.ts`:
    1. Add the following import on the top:
    ```TypeScript
    import { NewExperimentState } from "../new-experiment/newExperimentSlice";
    ```
    2. Add a field to `SequenceDocument`, like
    ```TypeScript
    export interface SequenceDocument {
        /* previous fields */
        newExperiment: NewExperimentState
    }
    ```
    3. Add an entry to the return value of `SelectSequenceDocument`, like
    ```TypeScript
    export const selectSequenceState = (state: RootState) => ({
        /* previous entries */
        newExperiment: state.newExperiment
    } as SequenceDocument);
    ```
7. Modify `/src/features/util/selector.ts`:
    1. Add the following import on the top:
    ```TypeScript
    import { selectNewExperimentById } from "../new-experiment/NewExperimentSlice";
    ```
    2. Add the following `||` to `selectExperimentById`, like
    ```TypeScript
    export const selectExperimentById = (state: RootState, id: EntityId) => {
        return (
            /* previous operations */ ||
            selectNewExperimentById(state, id)
        );
    }
    ```
8. Modify `/src/features/subsequence/widget/AddExperiment.tsx`:
    1. Add the following import on the top:
    ```TypeScript
    import { defaultNewExperimentEntity, newExperimentAddedCreator } from "../../new-experiment/newExperimentSlice";
    ```
    2. Add the an import for `newExperimentIcon` on the top.
    2. Add the following to the collection of `<Tooltip>`, like
    ```tsx
    <Tooltip title="New Experiment" aria-label="add New Experiment" >
        <IconButton
            onClick={() => {
                dispatch(newExperimentAddedCreator({
                    subsequenceId: props.id,
                    experimentEntity: defaultNewExperimentEntity()
                }));
                setOpen(false);
            }}
            classes={{
                root: classes.fontAwesomeWrapper
            }}
        >
            <FontAwesomeIcon icon={newExperimentIcon} size="sm" />
        </IconButton>
    </Tooltip>
    ```
9. Add a tsx file under `/src/features/new-experiment`, with the name `NewExperimentTab.tsx`.
10. Write and export in `NewExperimentTab.tsx` at least the following: (assuming that the experiment has children)
    ```TypeScript
    import { useDispatch, useSelector } from 'react-redux';
    import { RootState } from '../../app/store';
    import { TabAction } from "../../widget/TabAction";
    import { TabCollapse } from "../../widget/TabCollapse";
    import { SubsequenceTab } from '../subsequence/SubsequenceTab';
    import { ExperimentTabProps } from '../util/props';
    import { tabStyles } from '../util/styles';
    import { Channel } from "../keithley-simple/channel/Channel";
    import { NewExperimentEntity, newExperimentUpdated, newExperimentVariableChanged } from './keithley2636Slice';
    import { getNewExperimentRecipeVariables } from 'material-science-experiment-recipes/lib/new-experiment-recipe';
    import { VariableTable } from '../../widget/VariableTable';


    const useStyles = makeStyles((theme: Theme) => createStyles({
        ...tabStyles(theme),
    }));

    interface Props extends ExperimentTabProps {
        entity: NewExperimentEntity
    }

    export const NewExperimentTab: React.FC<Props> = (props) => {
        const theme = useTheme();
        const classes = useStyles(theme);
        const dispatch = useDispatch();

        const handleChange = (name: string, value: any) => {
            dispatch(newExperimentUpdated({
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
                            New Experiment
                        </Typography>
                        {/* your own controls */}
                        <VariableTable
                            id={props.entity.id}
                            availableVariables={getNewExperimentRecipeVariables(props.entity.recipe)}
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
    ```
11. Modify `/src/features/subsequence/SubsequenceTab.tsx`:
    1. Add the following imports on the top:
    ```Typescript
    import { isNewExperimentEntity } from "../new-experiment/newExperimentSlice"
    import { NewExperimentTab } from "../new-experiment/NewExperimentTab"
    ```
    2. Add the following code to the return value of `DraggableExperiment`:
    ```TypeScript
    {isNewExperimentEntity(experiment) &&
        <NewExperimentTab
            remove={() => dispatch(experimentRemoved({
                subsequenceId: id,
                experimentId: experiment.id
            }))}
            open={open}
            setOpen={setOpen}
            entity={experiment}
        />
    }
    ```

