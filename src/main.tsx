import * as React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TableContainer from "./Components/Table/TableContainer";
import InteractionSpace from "./Components/InteractionSpace/InteractionSpace";
// @ts-ignore
import { Provider } from 'react-redux'
import {configureStore, createStore} from "@reduxjs/toolkit";
import globalTableDataReducer from './Entities/Table/globalStateStore';

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
                    <TableContainer/>
                </Col>
                <Col>
                    <InteractionSpace/>
                </Col>
            </Row>
        </div>
    );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const store = configureStore({
    reducer: {
        globalTableData: globalTableDataReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ['globalTableData/updateGlobalTableData'],
            ignoredPaths: ['globalTableData.value']
        }
    })
})

export type RootState = ReturnType<typeof store.getState>

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);
