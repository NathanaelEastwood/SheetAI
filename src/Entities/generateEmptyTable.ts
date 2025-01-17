import TableData from "./TableData";

function generateEmptyTable(height: number, width: number): TableData {
    let internalData: [string, string][][];
    internalData = Array.from({length: height}, () =>
        Array.from({length: width}, () => ['', ''])  // Each element is now a tuple [string, string]
    );
    return new TableData(internalData);
}

export default generateEmptyTable;