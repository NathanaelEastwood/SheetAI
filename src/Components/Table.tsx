import TableRow from "./TableRow";
import TableHead from "./TableHead";
import TableProperties from "../Entities/TableProperties";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";


const Table: React.FC<TableProperties> = ({coordinates, height, width}) => {
    return (
        <Col>
            <Row style={{height:coordinates.topWhiteSpace}}>
            </Row>
            <Row>
                <table style={{position: 'relative'}}>
                    <TableHead width={width} wholeCellOffset={0}></TableHead>
                    {Array.from({ length: height }, (_, i) => <TableRow key={i} rowNumber={i} width={width} />)}
                </table>
            </Row>
            <Row style={{height:coordinates.bottomWhiteSpace}}>
            </Row>
        </Col>
    )
}

export default Table;