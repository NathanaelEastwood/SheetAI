class TableData {
    constructor(data: [string, string][][]) {
        this._data = data;
    }

    get data(): [string, string][][] {
        return this._data;
    }

    set data(value: [string, string][][]) {
        this._data = value;
    }

    private _data: [string, string][][];

    // Use a method instead of a setter to modify cell values
    setCellValue(value: [string, string], columnNumber: number, rowNumber: number): TableData {
        const newData = new TableData(this.data);  // Assuming 'data' is a 2D array or similar
        newData.data[rowNumber][columnNumber] = value;
        return newData;
    }

    getCellValue(column: number, row: number): [string, string] {
        return this._data[row][column];
    }

    extendXDirection(distance: number){
        const height = this._data.length
        const fillerArray: [string, string][] = Array.from({ length: distance }, () => ['', '']);
        for(let i = 0; i < height; i++)
        {
            this._data[i].push(...fillerArray);
        }
        return this;
    }

    extendYDirection(distance: number) {
        const width = this._data[0].length
        const fillerArray: [string, string][] = Array.from({ length: width }, () => ['', '']);
        for (let i = 0; i < distance; i++){
            this._data.push(fillerArray);
        }

        return this;
    }
}

export default TableData;