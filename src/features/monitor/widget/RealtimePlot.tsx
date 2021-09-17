import { Chart as RawChart } from 'chart.js';
import 'chartjs-adapter-luxon';
import StreamingPlugin from 'chartjs-plugin-streaming';
import 'chartjs-plugin-zoom';
import ZoomPlugin from 'chartjs-plugin-zoom';
import { useCallback, useEffect, useState } from 'react';
import { Chart, Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import Color from 'color';
import { useTheme } from '@material-ui/core';
import { TimeStampedValuesSelector } from '../monitorSlice';


/**
 * See https://www.chartjs.org/docs/3.3.1/samples/utils.html.
 */

export const CHART_COLORS = {
    red: Color('rgb(255, 99, 132)'),
    orange: Color('rgb(255, 159, 64)'),
    yellow: Color('rgb(255, 205, 86)'),
    green: Color('rgb(75, 192, 192)'),
    blue: Color('rgb(54, 162, 235)'),
    purple: Color('rgb(153, 102, 255)'),
    grey: Color('rgb(201, 203, 207)')
};

/**
 * See https://nagix.github.io/chartjs-plugin-streaming/latest/tutorials/react/stream.html.
 */

Chart.register(ZoomPlugin);
Chart.register(StreamingPlugin);

interface DataProps {
    setData: (data: Array<{ x: number, y: number }>) => void,
    selector: TimeStampedValuesSelector<number>
}

const MonitorTabData: React.FC<DataProps> = (props) => {
    const data = useSelector(props.selector);

    useEffect(() => {
        props.setData(data.map(({ time, value }) => ({
            x: time, y: value
        })));
    });
    return (<></>);
}

interface Props {
    selector: TimeStampedValuesSelector<number>,
    moreSelector?: TimeStampedValuesSelector<number>,
    label: string,
    moreLabel?: string,
    tickFormat?: (value: number) => string,
    moreTickFormat?: (value: number) => string,
    title?: string
}

export const RealtimePlot: React.FC<Props> = (props) => {
    const theme = useTheme();
    const [rawChart, setRawChart] = useState<RawChart | undefined>();

    const setData = useCallback((data: Array<{ x: number, y: number }>) => {
        if (rawChart) {
            const chart: RawChart = rawChart;
            let currentData = chart.data.datasets[0].data;
            currentData.push(...data.slice(currentData.length));
            chart.update('quiet');
        }
    }, [rawChart]);

    const setMoreData = useCallback((data: Array<{ x: number, y: number }>) => {
        if (rawChart) {
            const chart: RawChart = rawChart;
            let currentData = chart.data.datasets[1].data;
            currentData.push(...data.slice(currentData.length));
            chart.update('quiet');
        }
    }, [rawChart]);

    const measuredRef = useCallback(node => {
        if (node) setRawChart(node);
    }, []);

    return (
        <>
            <Line
                ref={measuredRef}
                data={{
                    datasets: [{
                        label: props.label,
                        backgroundColor: CHART_COLORS.red.alpha(0.5).rgb().string(),
                        borderColor: CHART_COLORS.red.rgb().string(),
                        borderDash: [8, 4],
                        fill: false,
                        data: [] as Array<{ x: number, y: number }>,
                        yAxisID: "y",
                    }, ...(props.moreSelector ? [{
                        label: props.moreLabel,
                        backgroundColor: CHART_COLORS.blue.alpha(0.5).rgb().string(),
                        borderColor: CHART_COLORS.blue.rgb().string(),
                        borderDash: [8, 4],
                        fill: false,
                        data: [] as Array<{ x: number, y: number }>,
                        yAxisID: "y1",
                    }] : [])]
                }}
                options={{
                    responsive: true,
                    aspectRatio: 1.5,
                    scales: {
                        x: {
                            type: 'realtime',
                            realtime: {
                                ttl: Number.MAX_SAFE_INTEGER,
                                delay: -10000,
                                duration: 60000
                                /* onRefresh: (chart: RawChart) => {
                                    chart.data.datasets.forEach((dataset) => {
                                        dataset.data.push({
                                            x: Date.now(),
                                            y: Math.random()
                                        });
                                    });
                                } */
                            }
                        },
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            ticks: {
                                color: CHART_COLORS.red.mix(Color(theme.palette.text.primary), 0.6).rgb().string(),
                                callback: props.tickFormat || String
                            }
                        },
                        ...(props.moreSelector ? {
                            y1: {
                                type: 'linear',
                                display: true,
                                position: 'right',
                                ticks: {
                                    color: CHART_COLORS.blue.mix(Color(theme.palette.text.primary), 0.6).rgb().string(),
                                    callback: props.moreTickFormat || String
                                },
                                // grid line settings
                                grid: {
                                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                                },
                            },
                        } : { })
                    },
                    interaction: {
                        intersect: false
                    },
                    plugins: {
                        zoom: {
                            // Assume x axis has the realtime scale
                            pan: {
                                enabled: true,        // Enable panning
                                mode: 'x'             // Allow panning in the x direction
                            },
                            zoom: {
                                pinch: {
                                    enabled: true       // Enable pinch zooming
                                },
                                wheel: {
                                    enabled: true       // Enable wheel zooming
                                },
                                mode: 'x'             // Allow zooming in the x direction
                            },
                            limits: {
                                x: {
                                    minDelay: -Number.MAX_SAFE_INTEGER,     // Min value of the delay option
                                    maxDelay: Number.MAX_SAFE_INTEGER,     // Max value of the delay option
                                    minDuration: 6000,  // Min value of the duration option
                                    maxDuration: 86400000   // Max value of the duration option
                                }
                            }
                        },
                        title: {
                            display: !!props.title,
                            text: props.title
                        }
                    }
                }}
            />
            <MonitorTabData {...props} {...{ setData }} />
            {props.moreSelector && <MonitorTabData selector={props.moreSelector} setData={setMoreData} />}
        </>
    )
}