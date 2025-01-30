import TableData from "./TableData";
import Cell from "./Cell";
import parse from "./FormulaParser";

function evaluateDependencies(tableData: TableData, originCell: Cell): TableData {
    originCell.Dependants.forEach(dependant => {
        let dependantCell = tableData.getCellValueByReference(dependant);
        if (dependantCell.UnderlyingValue[0] == '=') {
            tableData.setCellValue(parse(dependantCell, tableData, dependant, false), dependant[0], dependant[1]);
        }
        if (dependantCell.Dependants.size > 0) {
            evaluateDependencies(tableData, dependantCell);
        }
    })

    return new TableData(tableData.data);
}

export default evaluateDependencies;