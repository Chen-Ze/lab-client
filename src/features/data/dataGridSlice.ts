import { GridColDef, GridColumns, GridRowData } from "@mui/x-data-grid";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";


interface DataGridState {
    columns: GridColumns,
    rows: GridRowData[]
}

const initialState: DataGridState = {
    columns: [],
    rows: []
};

const dataGridSlice = createSlice({
    name: "dataGrid",
    initialState,
    reducers: {
        columnAdded: (state, action: PayloadAction<GridColDef>) => {
            if (state.columns.findIndex(column => column.field === action.payload.field) >= 0) return;
            state.columns.push(action.payload);
        },
        columnRemovedByField: (state, action: PayloadAction<string>) => {
            state.columns = state.columns.filter((column) => column.field !== action.payload);
        },
    },
});

export const {
    columnAdded,
    columnRemovedByField
} = dataGridSlice.actions;

export default dataGridSlice.reducer;

export const selectDataGridColumns = (state: RootState) =>
    state.dataGrid.columns;

export const selectDataGridRows = (state: RootState) =>
    state.dataGrid.rows;
