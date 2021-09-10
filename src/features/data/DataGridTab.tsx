import { Box, createStyles, FormControl, IconButton, InputAdornment, makeStyles, MenuItem, OutlinedInput, Select, Theme, Tooltip, useTheme } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import dateFormat from 'dateformat';
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
    toolBarContainer: {
        display: "flex",
        overflowX: "auto",
        overflowY: "hidden",
        "& > *": {
            flexShrink: 0
        },
        "&::-webkit-scrollbar": {
            display: "none",
        },
        scrollbarWidth: "none",  /* Firefox */
    },
    toolBarTools: {
        flexShrink: 0
    }
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
                cellClassName: 'data-grid-monospace',
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
        <GridToolbarContainer className={classes.toolBarContainer} >
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
            <Box className={classes.toolBarTools} >
                <Tooltip title="Warning: Hidden columns will NOT be exported." aria-label="export">
                    <GridToolbarExport csvOptions={{
                        fileName: `${dateFormat(new Date(), 'yyyy-mm-dd-HH-MM-ss')}`
                    }} />
                </Tooltip>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
            </Box>
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