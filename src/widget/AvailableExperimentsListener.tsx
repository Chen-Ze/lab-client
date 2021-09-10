import React, { useEffect } from 'react';
import { useEventSource, useEventSourceListener } from "@react-nano/use-event-source";
import { availableExperimentIdListUpdated } from '../features/experiments/experimentsSlice';
import axios from 'axios';
import { useDispatch } from 'react-redux';

export const AvailableExperimentsListener: React.FC<{}> = (props) => {
    const dispatch = useDispatch();
    const [availableExperimentIdListSource] = useEventSource("/server/available-experiments", true);
    useEventSourceListener(availableExperimentIdListSource, ['update'], e => {
        const list = JSON.parse(e.data);
        dispatch(availableExperimentIdListUpdated(list));
    }, [dispatch]);
    useEffect(() => {
        axios.get('/server/trigger-available-experiments');
    }, [availableExperimentIdListSource]);
    return (<></>);
};
