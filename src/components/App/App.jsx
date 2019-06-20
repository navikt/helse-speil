import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import HeaderBar from '../HeaderBar/HeaderBar';
import MainContentWrapper from '../MainContentWrapper/MainContentWrapper';
import { whoami } from '../../io/http';
import AuthContext from '../../context/AuthContext';
import BehandlingerContext from '../../context/BehandlingerContext';
import './App.css';
import 'reset-css';
import ErrorModal from '../widgets/modal/ErrorModal';

const App = () => {
    const [error, setError] = useState(undefined);
    const [authState, setAuthState] = useState({});
    const [behandlinger, setBehandlinger] = useState({ behandlinger: [] });

    useEffect(() => {
        if (!authState.name) {
            whoami().then(data => {
                if (data && data.name) {
                    setAuthState({ name: data.name });
                } else {
                    window.location.assign('/login');
                }
            }).catch(err => {
                setError(err.toString());
            });
        }
    }, [authState]);

    return (
        <AuthContext.Provider
            value={{ state: authState, setState: setAuthState }}
        >
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
                {error && (
                    <ErrorModal errorMessage={error} />
                )}
            </BehandlingerContext.Provider>
        </AuthContext.Provider>
    );
};

export default App;
