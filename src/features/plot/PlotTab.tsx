import { Typography } from '@material-ui/core';
import React from 'react';
import { DockTabProps } from '../dock/dock-properties';


interface Props extends DockTabProps {

}

export const PlotTab: React.FC<Props> = (props) => {
    return (
        <Typography>
            Test Plot
        </Typography>
    );
}
