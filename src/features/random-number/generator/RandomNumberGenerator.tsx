import { createStyles, FormControl, Grid, IconButton, makeStyles, TextField, Theme, useTheme } from "@material-ui/core";
import { RandomNumberGeneratorRecipe } from "material-science-experiment-recipes/lib/random-number-recipe";
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';


const useStyles = makeStyles((theme: Theme) => createStyles({
    item: {
        display: "flex",
        justifyContent: "center",
    },
    input: {
        fontFamily: "Courier New, monospace",
    },
}));

interface RandomNumberGeneratorProps {
    handleChange: (name: string, value: any) => void,
    remove: () => void,
    generator: RandomNumberGeneratorRecipe
}

export const RandomNumberGenerator: React.FC<RandomNumberGeneratorProps> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <Grid container spacing={1} justifyContent="center">
            <Grid item className={classes.item} xs={12} sm={6} md={3} >
                <FormControl variant="filled">
                    <TextField
                        value={props.generator.min}
                        onChange={(e) => props.handleChange('min', (e.target.value))}
                        label="Min"
                        InputProps={{
                            className: classes.input
                        }}
                    />
                </FormControl>
            </Grid>
            <Grid item className={classes.item} xs={12} sm={6} md={3} >
                <FormControl variant="filled">
                    <TextField
                        value={props.generator.max}
                        onChange={(e) => props.handleChange('max', (e.target.value))}
                        label="Max"
                        InputProps={{
                            className: classes.input
                        }}
                    />
                </FormControl>
            </Grid>
            <Grid item className={classes.item} xs={12} sm={6} md={3} >
                <FormControl variant="filled">
                    <TextField
                        value={props.generator.name}
                        onChange={(e) => props.handleChange('name', (e.target.value))}
                        label="Name"
                        InputProps={{
                            className: classes.input
                        }}
                    />
                </FormControl>
            </Grid>
            <Grid item className={classes.item} xs={12} sm={6} md={3} >
                <IconButton onClick={props.remove} >
                    <RemoveCircleOutlineIcon color="error" />
                </IconButton>
            </Grid>
        </Grid>
    );
}