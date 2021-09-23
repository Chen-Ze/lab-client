import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { experimentEndedDialogOpenSet, selectExperimentEndedDialogOpen } from '../features/experiments/experimentsSlice';


interface Props {
}

export const ExperimentEndedDialog: React.FC<Props> = () => {
    const open = useSelector(selectExperimentEndedDialogOpen);
    const dispatch = useDispatch();

    return (
        <Dialog
            open={open}
            onClose={() => dispatch(experimentEndedDialogOpenSet(false))}
        >
            <DialogTitle id="alert-dialog-title">Experiment Ended</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Experiment Ended
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => dispatch(experimentEndedDialogOpenSet(false))} color="primary" autoFocus >
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}