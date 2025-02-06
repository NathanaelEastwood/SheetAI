interface CellProperties {
    is_index_cell: boolean;
    cellId: string;
    visibleValue: string;
    internalValue: any;
}

const HeadCell: React.FC<CellProperties> = ({cellId, visibleValue, internalValue}) => {
    return (
        <th style={{background: "white", borderBottom: '1px solid slategrey', zIndex: 1}}>
            {visibleValue}
        </th>
    )
}


export default HeadCell;