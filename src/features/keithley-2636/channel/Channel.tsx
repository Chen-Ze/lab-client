import { createStyles, FormControl, FormControlLabel, Grid, Switch, Theme, Typography, useTheme, makeStyles } from '@material-ui/core';
import { FixedChannelRecipe, SMUMode, SMURecipe, SweepChannelRecipe } from 'material-science-experiment-recipes/lib/keithley-2636-simple-recipe';
import React from 'react';
import { CircuitInput } from './CircuitInput';
import { ModeSelect } from './ModeSelect';


const useStyles = makeStyles((theme: Theme) => createStyles({
    item: {
        display: "flex",
        justifyContent: "center",
    },
    title: {
        display: "flex",
        [theme.breakpoints.down('xs')]: {
            justifyContent: "center",
        },
    },
    mode: {
        display: "flex",
        [theme.breakpoints.down('xs')]: {
            justifyContent: "center",
        },
        [theme.breakpoints.only('sm')]: {
            justifyContent: "flex-end",
        },
    },
}));

interface OffChannelProps { }

const OffChannel: React.FC<OffChannelProps> = (props) => {
    return (<></>);
}

interface FreeChannelProps { }

const FreeChannel: React.FC<FreeChannelProps> = (props) => {
    return (<></>);
}

interface FixedCurrentChannelProps {
    handleChange: (name: string, value: any) => void,
    recipe: FixedChannelRecipe
}

const FixedCurrentChannel: React.FC<FixedCurrentChannelProps> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <Grid container spacing={1} justifyContent="center">
            <Grid item className={classes.item} xs={12}>
                <FormControl variant="filled">
                    <CircuitInput
                        value={String(props.recipe.value) || ''}
                        onChange={(e) => props.handleChange('value', (e.target.value))}
                        label="Value"
                        unit="A"
                    />
                </FormControl>
            </Grid>
            <Grid item className={classes.item} xs={12}>
                <FormControlLabel
                    control={
                        <Switch
                            name="turnOffAfterDone"
                            checked={props.recipe.turnOffAfterDone || false}
                            onChange={(e) => props.handleChange("turnOffAfterDone", e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Off After Done"
                />
            </Grid>
        </Grid>
    );
}

interface SweepCurrentChannelProps {
    handleChange: (name: string, value: any) => void,
    recipe: SweepChannelRecipe
}

const SweepCurrentChannel: React.FC<SweepCurrentChannelProps> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <Grid container spacing={1} justifyContent="center">
            <Grid item className={classes.item} xs={12}>
                <FormControl variant="filled">
                    <CircuitInput
                        value={String(props.recipe.start) || ''}
                        onChange={(e) => props.handleChange('start', (e.target.value))}
                        label="Start"
                        unit="A"
                    />
                </FormControl>
            </Grid>
            <Grid item className={classes.item} xs={12}>
                <FormControl variant="filled">
                    <CircuitInput
                        value={String(props.recipe.stop) || ''}
                        onChange={(e) => props.handleChange('stop', (e.target.value))}
                        label="End"
                        unit="A"
                    />
                </FormControl>
            </Grid>
            <Grid item className={classes.item} xs={12}>
                <FormControl variant="filled">
                    <CircuitInput
                        value={String(props.recipe.step) || ''}
                        onChange={(e) => props.handleChange('step', (e.target.value))}
                        label="Step"
                        unit="A"
                    />
                </FormControl>
            </Grid>
            <Grid item className={classes.item} xs={12}>
                <FormControlLabel
                    control={
                        <Switch
                            name="turnOffAfterDone"
                            checked={props.recipe.turnOffAfterDone || false}
                            onChange={(e) => props.handleChange("turnOffAfterDone", e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Off After Done"
                />
            </Grid>
        </Grid>
    );
}

interface FixedVoltageChannelProps {
    handleChange: (name: string, value: any) => void,
    recipe: FixedChannelRecipe
}

const FixedVoltageChannel: React.FC<FixedVoltageChannelProps> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <Grid container spacing={1} justifyContent="center">
            <Grid item className={classes.item} xs={12}>
                <FormControl variant="filled">
                    <CircuitInput
                        value={String(props.recipe.value) || ''}
                        onChange={(e) => props.handleChange('value', (e.target.value))}
                        label="Value"
                        unit="V"
                    />
                </FormControl>
            </Grid>
            <Grid item className={classes.item} xs={12}>
                <FormControlLabel
                    control={
                        <Switch
                            name="turnOffAfterDone"
                            checked={props.recipe.turnOffAfterDone || false}
                            onChange={(e) => props.handleChange("turnOffAfterDone", e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Off After Done"
                />
            </Grid>
        </Grid>
    );
}

interface SweepVoltageChannelProps {
    handleChange: (name: string, value: any) => void,
    recipe: SweepChannelRecipe
}

const SweepVoltageChannel: React.FC<SweepVoltageChannelProps> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <Grid container spacing={1} justifyContent="center">
            <Grid item className={classes.item} xs={12}>
                <FormControl variant="filled">
                    <CircuitInput
                        value={String(props.recipe.start) || ''}
                        onChange={(e) => props.handleChange('start', (e.target.value))}
                        label="Start"
                        unit="V"
                    />
                </FormControl>
            </Grid>
            <Grid item className={classes.item} xs={12}>
                <FormControl variant="filled">
                    <CircuitInput
                        value={String(props.recipe.stop) || ''}
                        onChange={(e) => props.handleChange('stop', (e.target.value))}
                        label="End"
                        unit="V"
                    />
                </FormControl>
            </Grid>
            <Grid item className={classes.item} xs={12}>
                <FormControl variant="filled">
                    <CircuitInput
                        value={String(props.recipe.step) || ''}
                        onChange={(e) => props.handleChange('step', (e.target.value))}
                        label="Step"
                        unit="V"
                    />
                </FormControl>
            </Grid>
            <Grid item className={classes.item} xs={12}>
                <FormControlLabel
                    control={
                        <Switch
                            name="turnOffAfterDone"
                            checked={props.recipe.turnOffAfterDone || false}
                            onChange={(e) => props.handleChange("turnOffAfterDone", e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Off After Done"
                />
            </Grid>
        </Grid>
    );
}

interface ChannelProps {
    title: String,
    recipe: SMURecipe,
    handleChange: (name: string, value: any) => void,
    setMode: (mode: SMUMode) => void,
    fixedModeOnly: boolean,
}

export const Channel: React.FC<ChannelProps> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    function channel() {
        switch (props.recipe.smuMode) {
            case SMUMode.Off:
                return <OffChannel />;
            case SMUMode.Free:
                return <FreeChannel />;
            case SMUMode.FixedCurrent:
                return <FixedCurrentChannel recipe={props.recipe} handleChange={props.handleChange} />;
            case SMUMode.SweepCurrent:
                return <SweepCurrentChannel recipe={props.recipe} handleChange={props.handleChange} />;
            case SMUMode.FixedVoltage:
                return <FixedVoltageChannel recipe={props.recipe} handleChange={props.handleChange} />;
            case SMUMode.SweepVoltage:
                return <SweepVoltageChannel recipe={props.recipe} handleChange={props.handleChange} />;
        }
    }

    return (
        <Grid container spacing={1} alignItems="center" justifyContent="center" >
            <Grid item className={classes.title} xs={12} sm={3} md={4} lg={3}>
                <Typography variant="h6" >
                    {props.title}
                </Typography>
            </Grid>
            <Grid item className={classes.mode} xs={12} sm={9} md={8} lg={9}>
                <ModeSelect mode={props.recipe.smuMode} setMode={props.setMode} fixedModeOnly={props.fixedModeOnly} />
            </Grid>
            {channel()}
        </Grid>
    );
}