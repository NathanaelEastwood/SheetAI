import * as React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure you import Bootstrap CSS-
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from "./Components/Table";

const App: React.FC = () => (
    <div className="vh-100 vw-100">
        <Row className = "h-25">
            <h1>Tool Bar Space</h1>
        </Row>
        <Row className = "h-75">
            <Col xs={12} md={8} style={{overflowX: "scroll", overflowY: "scroll", height: '100%', width: '66%'}} >
                <Table width={100} height={100}/>
            </Col>
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


