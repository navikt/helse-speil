import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import HeaderBar from '../HeaderBar/HeaderBar';
import MainContentWrapper from '../MainContentWrapper/MainContentWrapper';
import { BehandlingerProvider } from '../../context/BehandlingerContext';
import { InnrapporteringProvider } from '../../context/InnrapporteringContext';
import { withContextProviders } from '../../context/withContextProviders';
import './App.css';
import 'reset-css';

const App = withContextProviders(() => (
    <Router>
        <HeaderBar />
        <MainContentWrapper />
    </Router>
), [
    BehandlingerProvider,
    InnrapporteringProvider
]);

export default App;
