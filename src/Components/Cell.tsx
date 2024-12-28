interface CellProperties {
    leadingCell: boolean;
    cellId: string;
    rowNumber: number;
    visibleValue: string;
    internalValue: any;
}

const Cell: React.FC<CellProperties> = ({leadingCell, rowNumber, cellId, visibleValue, internalValue}) => {
    return (
        <td style={(leadingCell ? {position: "sticky", left: "0", background: "white"} : {})}>
            <p className={'cell_contents'}>
                {leadingCell ? rowNumber : visibleValue}
            </p>
        </td>
    )
}


export default Cell;