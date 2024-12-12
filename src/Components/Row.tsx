import Cell from "./Cell";

interface RowProperties {
    rowNumber: number;
    width: number;
}

const Row: React.FC<RowProperties> = ({width, rowNumber}) => {
    return (
        <tr /*style={{position: 'absolute', top: `${rowNumber * 29}px`, right: '0px'}}*/>
            {Array.from({length: width}, (_, i) => <Cell leadingCell={i == 0}
                                                         cellId={`${rowNumber}_${i}`} internalValue={undefined}
                                                         visibleValue={`${rowNumber}_${i}`} rowNumber={rowNumber}/>)}
        </tr>
    )
}


export default Row;