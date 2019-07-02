import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import HeaderBar from '../HeaderBar/HeaderBar';
import MainContentWrapper from '../MainContentWrapper/MainContentWrapper';
import { BehandlingerProvider } from '../../context/BehandlingerContext';
import './App.css';
import 'reset-css';
import { InnrapporteringProvider } from '../../context/InnrapporteringContext';

const App = () => {
    return (
        <BehandlingerProvider>
            <InnrapporteringProvider>
                <Router>
                    <HeaderBar />
                    <MainContentWrapper />
                </Router>
            </InnrapporteringProvider>
        </BehandlingerProvider>
    );
};

export default App;
