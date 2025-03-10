import * as React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TableContainer from "./Components/Table/TableContainer";
import InteractionSpace from "./Components/InteractionSpace/InteractionSpace";
import FormulaBar from './Components/Table/FormulaBar';
import Toolbar from './Components/Toolbar/Toolbar';
// @ts-ignore
import { Provider } from 'react-redux'
import { configureStore } from "@reduxjs/toolkit";
import globalTableDataReducer from './Entities/Table/globalStateStore';

// Define the type of your shared data
interface SharedData {
    // Adjust these properties to your needs:
    tableData: any; // for data from the table
    interactionData: any; // for data from the interaction space
}

const App: React.FC = () => {
    return (
        <>
            <div className="vh-100 vw-100">
                <Row style={{ height: '17%'}}>
                    <Toolbar />
                </Row>
                <Row style={{ height: '8%'}}>
                    <FormulaBar />
                </Row>
                <Row className="h-75" style={{ paddingLeft: 0 }}>
                    <Col style={{padding: 0}}>
                        <FormulaBar />
                        <TableContainer/>
                    </Col>
{/*                    <Col style={{padding: 0}}>
                        <InteractionSpace/>
                    </Col>*/}
                </Row>
            </div>
        </>
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
