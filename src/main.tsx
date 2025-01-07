import * as React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure you import Bootstrap CSS-
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TableContainer from "./Components/TableContainer";

const App: React.FC = () => (
    <div className="vh-100 vw-100">
        <Row className = "h-25">
            <h1>Tool Bar Space</h1>
        </Row>
        <Row className="h-75" style={{ paddingLeft: 0 }}>
            <TableContainer/>
            <Col xs={12} md={4}> {/* Updated breakpoint sizes */}
                <div className="interaction-space">
                    INTERACTION WORKSPACE
                </div>
            </Col>
        </Row>
    </div>
);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);


