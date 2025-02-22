import TableData from "./TableData";
import parse from "./FormulaParser";
import Cell from "./Cell";
import evaluateDependencies from "./DependencyEvaluator";

function shiftAndInsertCells(xOffset: number, yOffset: number, copiedCells: TableData, table: TableData, pasteLocation: [number, number]){
    let copiedCellHeight = copiedCells.data.length;
    let copiedCellWidth = copiedCells.data[0].length;

    for (let y= 0; y < copiedCellHeight; y++) {
        for (let x = 0; x < copiedCellWidth; x++) {
            let newCell;
            let newCellCoordinate: [number, number] = [pasteLocation[0] + x, pasteLocation[1] + y];
            if (copiedCells.data[y][x].UnderlyingValue[0] && copiedCells.data[y][x].UnderlyingValue[0] == "=") {
                const updatedFormula = shiftFormula(xOffset, yOffset, copiedCells.data[y][x].UnderlyingValue);
                newCell = parse(new Cell('', updatedFormula, new Set<[number, number]>()), table, newCellCoordinate);
            } else {
                newCell = structuredClone(copiedCells.data[y][x]);
                newCell.Dependants = table.getCellValue(newCellCoordinate[0], newCellCoordinate[1]).Dependants
            }
            table.setCellValue(newCell, newCellCoordinate[0], newCellCoordinate[1]);
            evaluateDependencies(table, table.getCellValue(newCellCoordinate[0], newCellCoordinate[1]), new Set<Cell>())
        }
    }
}

function shiftFormula(xOffset: number, yOffset: number, formula: string): string {
    let references = extractReferences(formula);

    let result = "";
    let lastIndex = 0;

    references.forEach(reference => {
        let matchIndex = formula.indexOf(reference, lastIndex); // Find next occurrence
        if (matchIndex === -1) return;

        // Append everything before the match
        result += formula.substring(lastIndex, matchIndex);

        // Shift and append the reference
        result += shiftReference(xOffset, yOffset, reference);

        // Update last index to continue after this match
        lastIndex = matchIndex + reference.length;
    });

    // Append any remaining part of the formula
    result += formula.substring(lastIndex);

    return result;
}


function shiftReference(xOffset: number, yOffset: number, reference: string): string {
    const match = reference.match(/([A-Z]+)(\d+)/);
    if (!match) return reference;

    let [_, colStr, rowStr] = match;
    let colIndex = columnToIndex(colStr);
    let rowIndex = parseInt(rowStr, 10);

    let newColIndex = colIndex + xOffset;
    let newRowIndex = rowIndex + yOffset;

    if (newColIndex < 0 || newRowIndex < 1) return reference; // Prevent invalid refs

    return `${indexToColumn(newColIndex)}${newRowIndex}`;
}

function extractReferences(formula: string): string[] {
    return formula.match(/[A-Z]+[0-9]+/g) || [];
}

function columnToIndex(col: string): number {
    return col.split("").reduce((acc, char) => acc * 26 + (char.charCodeAt(0) - 65), 0);
}

function indexToColumn(index: number): string {
    let columnName = "";
    while (index >= 0) {
        columnName = String.fromCharCode((index % 26) + 65) + columnName;
        index = Math.floor(index / 26) - 1;
    }
    return columnName;
}

export default shiftAndInsertCells;
