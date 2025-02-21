import TableData from "./TableData";
import tableData from "./TableData";
import Cell from "./Cell";
import {evaluateAST, parseFormulaToAST, tokenizeInput} from "../General/ASTHelperFunctions";
import {columnLetterToNumber, splitReference} from "../General/HelperFunctions";

let globalTableData : tableData;
let globalIntakeReference: [number, number];
let freshDependencyRun: boolean;

function parse(intakeCell: Cell, table: TableData, intakeReference: [number, number], freshDependencies?: boolean): Cell {
    // TODO: Strip redundant dependencies on formula change, this can be achieved by passing the old formula and removing all dependencies passed in.
    globalTableData = table;
    globalIntakeReference = intakeReference;
    freshDependencyRun = freshDependencies || true;
    const tokenizedInput = tokenizeInput(intakeCell.UnderlyingValue)
    const astValue = parseFormulaToAST(tokenizedInput)
    const resultantValue = evaluateAST(astValue, doLookup);

    let newDependants;
    if (freshDependencies) {
        newDependants = new Set<[number, number]>();
    } else {
        newDependants = intakeCell.Dependants;
    }

    // unwrap nested formula using a stack
    // do formula
    return new Cell(resultantValue.toString(), intakeCell.UnderlyingValue, newDependants);
}

function doLookup(reference: string): number {
    // TODO: Throw exception instead of evaluating to zero if cell contents are invalid.
    let values = splitReference(reference)
    const columnNumber = columnLetterToNumber(values.column)
    let result;
    try {
        let dependencyCell = globalTableData.getCellValue(columnNumber - 1, values.row - 1)
        if(freshDependencyRun) {
            dependencyCell.Dependants.add(globalIntakeReference);
        }
        result = Number(dependencyCell.RenderedValue)
        return result
    } catch (e) {
        return 0;
    }
}





export default parse;