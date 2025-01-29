import Cell from "./Cell";

class TableData {
    constructor(data: Cell[][]) {
        this._data = data;
    }

    get data(): Cell[][] {
        return this._data;
    }

    set data(value: Cell[][]) {
        this._data = value;
    }

    private _data: Cell[][];

    // Use a method instead of a setter to modify cell values
    setCellValue(value: Cell, columnNumber: number, rowNumber: number): TableData {
        const newData = new TableData(this.data);  // Assuming 'data' is a 2D array or similar
        newData.data[rowNumber][columnNumber] = value;
        return newData;
    }

    getCellValue(column: number, row: number): Cell {
        return this._data[row][column];
    }

    extendXDirection(distance: number){
        const height = this._data.length
        const fillerArray: Cell[] = Array.from({ length: distance }, () => new Cell('', '', []));
        for(let i = 0; i < height; i++)
        {
            this._data[i].push(...fillerArray);
        }
        return this;
    }

    extendYDirection(distance: number) {
        const width = this._data[0]?.length || 0; // Handle empty _data case
        const fillerArray: Cell[] = Array.from({ length: width }, () => new Cell('', '', []));

        for (let i = 0; i < distance; i++) {
            this._data.push([...fillerArray]);
        }

        return this;
    }

    copy (startColumn: number, endColumn: number, startRow: number, endRow: number): TableData {
        if (endColumn < startColumn) {
            let temp = endColumn
            endColumn = startColumn;
            startColumn = temp;
        }

        if (endRow < startRow) {
            let temp = endRow
            endRow = startRow;
            startRow = temp;
        }

        let result = []
        const splitRows = this._data.slice(startRow, endRow + 1);

        for (let i = 0; i < splitRows.length; i++) {
            let copiedRowData = splitRows[i].slice(startColumn, endColumn + 1);
            result.push(copiedRowData)
        }

        return new TableData(result);
    }

    paste (pasteBuffer: TableData, pasteColumnNumber: number, pasteRowNumber: number): Cell[][] {
        const height = pasteBuffer._data.length;
        const width = pasteBuffer._data[0].length;

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                this._data[i + pasteRowNumber][j + pasteColumnNumber] = pasteBuffer._data[i][j];
            }
        }

        return this._data;
    }
}

export default TableData;