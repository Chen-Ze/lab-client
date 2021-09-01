import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';


const useStyles = makeStyles({
    table: {
    },
});

interface Props {
    parameters: Array<{key: string, value: any}>
}

export const ParameterTable: React.FC<Props> = (props) => {
    const classes = useStyles();

    return (
        <TableContainer component={Paper} variant="outlined" >
            <Table className={classes.table} size="small" aria-label="a dense table">
                <TableBody>
                    {props.parameters.map(({key, value}) => (
                        <TableRow key={key}>
                            <TableCell component="th" scope="row">
                                {key}
                            </TableCell>
                            <TableCell align="center" >{value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}