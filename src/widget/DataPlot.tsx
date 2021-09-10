import React, { useState } from "react";
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import { useTheme, makeStyles, Switch, FormControlLabel, Grid, Theme, createStyles } from "@material-ui/core";

const Plot = createPlotlyComponent(Plotly);


const useStyles = makeStyles((theme: Theme) => createStyles({
    plot: {
        [theme.breakpoints.only("xs")]: {
            height: 250,
        },
        [theme.breakpoints.only("sm")]: {
            height: 350,
        },
        [theme.breakpoints.up("md")]: {
            height: 400,
        },
    },
    autoLayoutWrapper: {
        display: "flex",
        justifyContent: "center",
    },
    plotGridCell: {
        display: "flex",
        justifyContent: "center",
    },
}));

interface Props {
    data: Array<{
        points: Array<{ x: number, y: number }>,
        name?: string
    }>
    xLabel: string,
    yLabel: string
}

export const DataPlot: React.FC<Props> = ({ data, xLabel, yLabel }) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const [xRange, setXRange] = useState<any[] | undefined>();
    const [yRange, setYRange] = useState<any[] | undefined>();
    const [autoLayout, setAutoLayout] = useState(true);
    const [xLog, setXLog] = useState(false);
    const [yLog, setYLog] = useState(false);

    return (
        <Grid container className={classes.plotGridCell} >
            <Grid item xs={12} >
                <Plot
                    className={classes.plot}
                    data={data.map((trace) => (
                        {
                            x: trace.points.map(({ x }) => x),
                            y: trace.points.map(({ y }) => y),
                            name: trace.name,
                            type: 'scatter',
                            mode: 'lines+markers',
                        }
                    ))}
                    layout={{
                        dragmode: "pan",
                        margin: {
                            t: 10,
                            b: 70,
                            l: 70,
                            r: 70,
                        },
                        xaxis: {
                            range: autoLayout ? undefined : xRange,
                            type: xLog ? "log" : "linear",
                            title: {
                                text: xLabel,
                                font: {
                                    color: theme.palette.getContrastText(theme.palette.background.paper),
                                    family: "Courier New, monospace"
                                }
                            },
                            tickfont: {
                                color: theme.palette.getContrastText(theme.palette.background.paper)
                            },
                        },
                        yaxis: {
                            range: autoLayout ? undefined : yRange,
                            type: yLog ? "log" : "linear",
                            title: {
                                text: yLabel,
                                font: {
                                    color: theme.palette.getContrastText(theme.palette.background.paper),
                                    family: "Courier New, monospace"
                                },
                            },
                            tickfont: {
                                color: theme.palette.getContrastText(theme.palette.background.paper)
                            },
                        },
                        legend: {
                            x: 1,
                            xanchor: 'right',
                            y: 1,
                            bgcolor: '#0000',
                            font: {
                                family: "Courier New, monospace"
                            }
                        },
                        plot_bgcolor: theme.palette.getContrastText('#00f'),
                        paper_bgcolor: theme.palette.background.paper
                    }}
                    config={{
                        responsive: true,
                        scrollZoom: true,
                    }}
                    style={{
                        width: "100%",
                    }}
                    onRelayout={
                        (data) => {
                            const xrange = [data["xaxis.range[0]"], data["xaxis.range[1]"]];
                            const yrange = [data["yaxis.range[0]"], data["yaxis.range[1]"]];
                            setXRange(xrange);
                            setYRange(yrange);
                            setAutoLayout(false);
                        }
                    }
                />
            </Grid>
            <Grid item xs={12} lg={8} >
                <div className={classes.autoLayoutWrapper} >
                    <FormControlLabel
                        control={
                            <Switch
                                name="autoLayout"
                                checked={autoLayout}
                                onChange={e => setAutoLayout(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Auto Layout"
                    />
                </div>
            </Grid>
            <Grid item xs={12} lg={8} >
                <div className={classes.autoLayoutWrapper} >
                    <FormControlLabel
                        control={
                            <Switch
                                name="xLog"
                                checked={xLog}
                                onChange={e => setXLog(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="X-Axis Log Scale"
                    />
                </div>
            </Grid>
            <Grid item xs={12} lg={8} >
                <div className={classes.autoLayoutWrapper} >
                    <FormControlLabel
                        control={
                            <Switch
                                name="yLog"
                                checked={yLog}
                                onChange={e => setYLog(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Y-Axis Log Scale"
                    />
                </div>
            </Grid>
        </Grid>
    );
}
