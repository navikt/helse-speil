import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import HeaderBar from '../HeaderBar/HeaderBar';
import MainContentWrapper from '../MainContentWrapper/MainContentWrapper';
import { BehandlingerProvider } from '../../context/BehandlingerContext';
import { InnrapporteringProvider } from '../../context/InnrapporteringContext';
import { AuthProvider, AuthContext } from '../../context/AuthContext';
import { withContextProviders } from '../../context/withContextProviders';
import './App.css';
import 'reset-css';
import fetchIntercept from 'fetch-intercept';

const App = withContextProviders(() => {
    const { setUserLoggedOut } = useContext(AuthContext);

    useEffect(() => {
        fetchIntercept.register({
            responseError: error => {
                setUserLoggedOut();
                return Promise.reject(error);
            }
        });
    }, []);

    return (
        <Router>
            <HeaderBar />
            <MainContentWrapper />
        </Router>
    );
}, [InnrapporteringProvider, BehandlingerProvider, AuthProvider]);

export default App;
