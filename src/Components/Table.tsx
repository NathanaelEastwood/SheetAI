import Row from "./Row";
import TableHead from "./TableHead";

interface TableProperties {
    height: number;
    width: number;
}

const Table: React.FC<TableProperties> = ({height, width}) => {
    return (
        <table style={{position: 'relative'}}>
            <TableHead width={width} wholeCellOffset={0}></TableHead>
            {Array.from({length: height}, (_, i) => <Row rowNumber={i} width={width}/>)}
        </table>
    )
}

export default Table;