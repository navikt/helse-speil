import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import HeaderBar from '../HeaderBar/HeaderBar';
import MainContentWrapper from '../MainContentWrapper/MainContentWrapper';
import { BehandlingerProvider } from '../../context/BehandlingerContext';
import { InnrapporteringProvider } from '../../context/InnrapporteringContext';
import { AuthProvider } from '../../context/AuthContext';
import { withContextProviders } from '../../context/withContextProviders';
import { useLogUserOut } from '../../hooks/useLogUserOut';
import './App.css';
import 'reset-css';

const App = withContextProviders(() => {
    useLogUserOut();

    return (
        <Router>
            <HeaderBar />
            <MainContentWrapper />
        </Router>
    );
}, [InnrapporteringProvider, BehandlingerProvider, AuthProvider]);

export default App;
