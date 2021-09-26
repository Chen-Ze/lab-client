import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { alertErrorAdded } from '../features/alert/alertSlice';
import { rowsAdded } from '../features/data/dataGridSlice';
import { currentExperimentIdSet, experimentEndedDialogOpenSet, selectCurrentExperimentId } from '../features/experiments/experimentsSlice';


interface Props {
}

export const ExperimentDataListener: React.FC<Props> = (props) => {
    const dispatch = useDispatch();
    const currentExperimentId = useSelector(selectCurrentExperimentId);

    useEffect(() => {
        if (!currentExperimentId)
            return;
        const watchExperiment = new EventSource(`/server/watch-experiment?id=${currentExperimentId}`, { withCredentials: true });
        watchExperiment.addEventListener('update', (e: any) => {
            const response = JSON.parse(e.data);
            if (!response) {
                console.log("Watch-Experiment: event update: empty response.");
                return;
            }
            const rows = response.data;
            if (!rows) {
                console.log("Watch-Experiment: event update: empty data.");
                return;
            }
            dispatch(rowsAdded(rows));
            if (response.status === 'Terminated') {
                watchExperiment.close();
                dispatch(currentExperimentIdSet(''));
                dispatch(experimentEndedDialogOpenSet(true));
            }
        });
        watchExperiment.addEventListener('error', (e: any) => {
            const response = JSON.parse(e.data);
            if (!response) {
                console.log("Watch-Experiment: event error: empty response.");
                return;
            }
            dispatch(alertErrorAdded({
                message: JSON.stringify(response, null, 4)
            }));
        });
        return () => watchExperiment.close();
    }, [currentExperimentId, dispatch]);
    return (<></>);
};
