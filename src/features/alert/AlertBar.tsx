import Snackbar from '@material-ui/core/Snackbar';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { alertHidden, selectAllAlerts } from './alertSlice';


export function AlertBar() {
    const dispatch = useDispatch();
    const allAlerts = useSelector(selectAllAlerts);
    const showAlerts = allAlerts.filter(alert => alert.show);


    return (
        <>
            {
                showAlerts.map(alert => (
                    <Snackbar
                        open={true}
                        autoHideDuration={6000}
                        onClose={(e) => dispatch(alertHidden(alert.id))}
                        key={alert.id}
                    >
                        <Alert onClose={(e) => dispatch(alertHidden(alert.id))} severity={alert.severity} >
                            {alert.message}
                        </Alert>
                    </Snackbar>
                ))
            }
        </>
    );
}