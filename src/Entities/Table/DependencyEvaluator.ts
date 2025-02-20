import TableData from "./TableData";
import Cell from "./Cell";
import parse from "./FormulaParser";

function evaluateDependencies(tableData: TableData, originCell: Cell, visitedSet: Set<Cell>): TableData {
    // TODO: Rollback inserted dependencies when a circular dependency is added.
    // TODO: Fix bug where cells pasted into previous references do not have their dependencies correctly evaluated. I.e. paste into A1 when B1 references it, and it will not re-render.
    let newVisitedSet = new Set(visitedSet).add(originCell);
    if (newVisitedSet.size != visitedSet.size + 1) {
        throw new Error("Circular dependency detected!");
    }
    originCell.Dependants.forEach(dependant => {
        let dependantCell = tableData.getCellValueByReference(dependant);
        if (dependantCell.UnderlyingValue[0] == '=') {
            tableData.setCellValue(parse(dependantCell, tableData, dependant, false), dependant[0], dependant[1]);
        }
        if (dependantCell.Dependants.size > 0) {
            evaluateDependencies(tableData, dependantCell, newVisitedSet);
        }
    })

    return new TableData(tableData.data);
}

export default evaluateDependencies;