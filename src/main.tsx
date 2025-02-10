import * as React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TableContainer from "./Components/Table/TableContainer";
import InteractionSpace from "./Components/InteractionSpace/InteractionSpace";

// Define the type of your shared data
interface SharedData {
    // Adjust these properties to your needs:
    tableData: any; // for data from the table
    interactionData: any; // for data from the interaction space
}

const App: React.FC = () => {
    // Create state for the shared data.
    const [sharedData, setSharedData] = React.useState<SharedData>({
        tableData: null,
        interactionData: null,
    });

    // Functions to update parts of the shared data.
    const updateTableData = (data: any) => {
        setSharedData(prev => ({ ...prev, tableData: data }));
    };

    const updateInteractionData = (data: any) => {
        setSharedData(prev => ({ ...prev, interactionData: data }));
    };

    return (
        <div className="vh-100 vw-100">
            <Row className="h-25">
                <h1>Tool Bar Space</h1>
            </Row>
            <Row className="h-75" style={{ paddingLeft: 0 }}>
                <Col>
                    <TableContainer
                        tableData={sharedData.tableData}
                        updateTableData={updateTableData}
                        // Optionally, if TableContainer needs to know about the interaction data:
                        interactionData={sharedData.interactionData}
                    />
                </Col>
                <Col>
                    <InteractionSpace
                        interactionData={sharedData.interactionData}
                        updateInteractionData={updateInteractionData}
                        // Optionally, if InteractionSpace needs to know about the table data:
                        tableData={sharedData.tableData}
                    />
                </Col>
            </Row>
        </div>
    );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
