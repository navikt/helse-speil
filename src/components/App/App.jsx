import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import HeaderBar from '../HeaderBar/HeaderBar';
import MainContentWrapper from '../MainContentWrapper/MainContentWrapper';
import { AuthProvider } from '../../context/AuthContext';
import { BehandlingerProvider } from '../../context/BehandlingerContext';
import { InnrapporteringProvider } from '../../context/InnrapporteringContext';
import './App.css';
import 'reset-css';

const App = () => (
    <AuthProvider>
        <BehandlingerProvider>
            <InnrapporteringProvider>
                <Router>
                    <HeaderBar />
                    <MainContentWrapper />
                </Router>
            </InnrapporteringProvider>
        </BehandlingerProvider>
    </AuthProvider>
);

export default App;
