import * as React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure you import Bootstrap CSS-
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TableContainer from "./Components/Table/TableContainer";
import InteractionSpace from "./Components/InteractionSpace/InteractionSpace";

const App: React.FC = () => (
    <>
        <script src="https://cdn.jsdelivr.net/npm/rete/rete.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/rete-area-plugin/rete-area-plugin.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/rete-connection-plugin/rete-connection-plugin.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/rete-render-utils/rete-render-utils.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/rete-react-plugin/rete-react-plugin.min.js"></script>

        <div className="vh-100 vw-100">
        <Row className="h-25">
            <h1>Tool Bar Space</h1>
            </Row>
            <Row className="h-75" style={{ paddingLeft: 0 }}>
                <Col>
                    <TableContainer/>
                </Col>
                <Col>
                    <div className="interaction-space">
                        <InteractionSpace></InteractionSpace>
                    </div>
                </Col>
        </Row>
    </div>
    </>
    );

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);


