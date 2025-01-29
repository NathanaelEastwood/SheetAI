import TableData from "./TableData";
import Cell from "./Cell";

function generateEmptyTable(height: number, width: number): TableData {
    let internalData: Cell[][];
    internalData = Array.from({length: height}, () =>
        Array.from({length: width}, () => new Cell('', '', []))  // Each element is now a tuple [string, string]
    );
    return new TableData(internalData);
}

export default generateEmptyTable;