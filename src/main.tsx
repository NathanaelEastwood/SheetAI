import * as React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TableContainer from "./Components/Table/TableContainer";
import FormulaBar from './Components/Table/FormulaBar';
import Toolbar from './Components/Toolbar/Toolbar';
import {Provider, useSelector} from 'react-redux'
import { configureStore } from "@reduxjs/toolkit";
import globalTableDataReducer from './Entities/Table/globalStateStore';
import globalDarkModeReducer from './Entities/Theme/themeStateStore';
import AgentChat from './Components/Agent/AgentChat';
import SupabaseAuth from './Auth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {AuthProvider} from "./Authorisation/AuthContext";
import PrivateRoute from "./Authorisation/PrivateRouter";

const App: React.FC = () => {
    const darkModeState: boolean = useSelector((state: RootState) => state.globalDarkMode);
    return (
            <div className="vh-100 vw-100" style={{
                backgroundColor: darkModeState ? "white" : "black"
            }}>
                <Row style={{ height: '17vh'}}>
                    <Toolbar />
                </Row>
                <Row style={{ height: '8vh'}}>
                    <FormulaBar />
                </Row>
                <Row className="h-75" style={{ paddingLeft: 0 }}>
                    <Col style={{padding: 0}}>
                        <TableContainer/>
                    </Col>
                </Row>
                <AgentChat/>  
            </div>
    );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const store = configureStore({
    reducer: {
        globalTableData: globalTableDataReducer,
        globalDarkMode: globalDarkModeReducer,
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
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={ <SupabaseAuth /> } />
                        <Route path="/login" element={ <SupabaseAuth/> } />
                        <Route element = {<PrivateRoute />} >
                            <Route path="/app" element={<App />} />
                        </Route>
                    </Routes>
                </Router>
            </AuthProvider>
        </Provider>
    </React.StrictMode>
);