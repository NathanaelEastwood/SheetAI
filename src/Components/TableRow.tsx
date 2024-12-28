import Cell from "./Cell";

interface RowProperties {
    rowNumber: number;
    width: number;
}

const TableRow: React.FC<RowProperties> = ({width, rowNumber}) => {
    return (
        <tr>
            {Array.from({length: width}, (_, i) => <Cell key={i} leadingCell={i == 0}
                                                         cellId={`${rowNumber}_${i}`} internalValue={undefined}
                                                         visibleValue={`${rowNumber}_${i}`} rowNumber={rowNumber}/>)}
        </tr>
    )
}


export default TableRow;