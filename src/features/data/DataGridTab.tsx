import { createStyles, FormControl, IconButton, InputAdornment, makeStyles, MenuItem, OutlinedInput, Select, Theme, useTheme } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DockTabProps } from '../dock/dock-properties';
import { columnAdded, columnRemovedByField, selectDataGridColumns, selectDataGridRows } from './dataGridSlice';


const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        border: "none",
        borderRadius: "0",
        '& .data-grid-monospace': {
            fontFamily: "Courier New, monospace",
        },
    },
    toolBarControl: {
        margin: theme.spacing(0, 1),
        width: "20ch"
    },
    monospace: {
        fontFamily: "Courier New, monospace",
    },
}));

function EditToolbar() {
    const theme = useTheme();
    const classes = useStyles(theme);

    const dispatch = useDispatch();
    const [newColumnName, setNewColumnName] = useState('');
    const [removeColumnName, setRemoveColumnName] = useState('');
    const columns = useSelector(selectDataGridColumns);

    const handleAdd = (columnName?: string) => {
        if (!columnName) {
            columnName = newColumnName;
        }
        if (columnName) {
            dispatch(columnAdded({
                field: newColumnName.trim(),
                headerClassName: 'data-grid-monospace',
                headerAlign: 'center',
                width: 200
            }));
            setNewColumnName('');
        }
    };

    const handleRemove = () => {
        if (removeColumnName) {
            dispatch(columnRemovedByField(removeColumnName));
            setRemoveColumnName('');
        }
    };

    return (
        <GridToolbarContainer >
            <FormControl variant="outlined" margin="dense" className={classes.toolBarControl} >
                <OutlinedInput
                    value={newColumnName}
                    onChange={(e) => {
                        setNewColumnName(e.target.value);
                    }}
                    inputProps={{
                        className: classes.monospace,
                        onKeyDown: (e) => {
                            if (e.key === "Enter") {
                                handleAdd(e.currentTarget.value);
                            }
                        }
                    }}
                    startAdornment={
                        <InputAdornment position="start">
                            <IconButton
                                onClick={(e) => handleAdd()}
                                edge="start"
                            >
                                <AddIcon color="primary" fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
            <FormControl variant="outlined" margin="dense" className={classes.toolBarControl} >
                <Select
                    value={removeColumnName}
                    onChange={e => setRemoveColumnName(String(e.target.value))}
                    className={classes.monospace}
                    startAdornment={
                        <InputAdornment position="start">
                            <IconButton
                                onClick={handleRemove}
                                edge="start"
                            >
                                <RemoveIcon color="error" fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    }
                >
                    {columns.map((column) => {
                        return (
                            <MenuItem
                                className={classes.monospace}
                                key={column.field}
                                value={column.field}
                            >
                                {column.field}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </GridToolbarContainer>
    );
}

interface Props extends DockTabProps {

}

export const DataGridTab: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const columns = useSelector(selectDataGridColumns);
    const rows = useSelector(selectDataGridRows);

    /* const { data } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 100000,
        editable: true,
    });

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <DataGrid
                {...data}
                loading={data.rows.length === 0}
                rowHeight={38}
                checkboxSelection
                disableSelectionOnClick
                classes={{
                    root: classes.root
                }}
            />
        </div>
    );
    */
    return (
        <div style={{ height: "100%", width: "100%" }}>
            <DataGrid
                {...{ columns, rows }}
                components={{
                    Toolbar: EditToolbar,
                }}
                classes={{
                    root: classes.root
                }}
            />
        </div>
    );
}