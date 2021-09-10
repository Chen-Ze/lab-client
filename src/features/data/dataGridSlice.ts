import { GridColDef, GridColumns, GridRowData } from "@mui/x-data-grid";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { sequenceImported } from "../sequence/sequenceSlice";


interface DataGridState {
    columns: GridColumns,
    rows: GridRowData[],
    ids: string[]
}

const initialState: DataGridState = {
    columns: [],
    rows: [],
    ids: []
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
        rowAdded: (state, action: PayloadAction<GridRowData>) => {
            if (state.ids.includes(action.payload.id)) return;
            state.ids.push(action.payload.id);
            state.rows.push(action.payload);
        },
        rowsAdded: (state, action: PayloadAction<GridRowData[]>) => {
            action.payload.forEach((row) => {
                if (state.ids.includes(row.id)) return;
                state.ids.push(row.id);
                state.rows.push(row);
            });
        },
    },
    extraReducers: (builder) => {
        builder.addCase(sequenceImported, (state, {payload}) => {
            state.columns = payload.dataGrid.columns;
        });
    }
});

export const {
    columnAdded,
    columnRemovedByField,
    rowAdded,
    rowsAdded
} = dataGridSlice.actions;

export default dataGridSlice.reducer;

export const selectDataGridColumns = (state: RootState) =>
    state.dataGrid.columns;

export const selectDataGridRows = (state: RootState) =>
    state.dataGrid.rows;
