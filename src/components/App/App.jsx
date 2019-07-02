import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import HeaderBar from '../HeaderBar/HeaderBar';
import MainContentWrapper from '../MainContentWrapper/MainContentWrapper';
import BehandlingerContext from '../../context/BehandlingerContext';
import './App.css';
import 'reset-css';

const App = () => {
    const [error, setError] = useState(undefined);
    const [behandlinger, setBehandlinger] = useState({ behandlinger: [] });

    return (
        <BehandlingerContext.Provider
            value={{
                state: behandlinger,
                setBehandlinger: setBehandlinger
            }}
        >
            <Router>
                <HeaderBar />
                <MainContentWrapper />
            </Router>
            {error && <ErrorModal errorMessage={error} />}
        </BehandlingerContext.Provider>
    );
};

export default App;
