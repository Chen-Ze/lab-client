import { GridRowData } from "@mui/x-data-grid";
import { lastElement } from "./util";


export interface GroupedRows {
    id: string,
    column: string,
    value: any,
    rows: GridRowData[]
}

export function groupRows(rows: GridRowData[], groupBy: string) {
    return rows.reduce<GroupedRows[]>((chunks, row) => {
        if (row[groupBy] !== undefined)
            chunks.push({
                id: row.id,
                column: groupBy,
                value: row[groupBy],
                rows: [row]
            })
        else if (chunks.length) {
            lastElement(chunks)!.rows.push(row);
        }
        return chunks;
    }, []);
}