import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { rowsAdded } from '../features/data/dataGridSlice';
import { selectCurrentExperimentId } from '../features/experiments/experimentsSlice';

export const ExperimentDataListener: React.FC<{}> = (props) => {
    const dispatch = useDispatch();
    const currentExperimentId = useSelector(selectCurrentExperimentId);
    useEffect(() => {
        if (!currentExperimentId)
            return;
        const watchExperiment = new EventSource(`/server/watch-experiment?id=${currentExperimentId}`, { withCredentials: true });
        watchExperiment.addEventListener('update', (e: any) => {
            const response = JSON.parse(e.data);
            if (!response) {
                console.log("Watch-Experiment: empty response.");
                return;
            }
            const rows = response.data;
            if (!rows) {
                console.log("Watch-Experiment: empty data.");
                return;
            }
            dispatch(rowsAdded(rows));
            if (response.status === 'Terminated') {
                watchExperiment.close();
            }
        });
        return () => watchExperiment.close();
    }, [currentExperimentId, dispatch]);
    return (<></>);
};
