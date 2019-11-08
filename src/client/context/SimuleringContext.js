import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { postSimulering } from '../io/http';
import { AuthContext } from './AuthContext';
import { PersonContext } from './PersonContext';

export const SimuleringContext = createContext();

export const SimuleringProvider = ({ children }) => {
    const { personTilBehandling } = useContext(PersonContext);
    const { authInfo } = useContext(AuthContext);
    const [error, setError] = useState(undefined);
    const [simulering, setSimulering] = useState(undefined);

    useEffect(() => {
        if (personTilBehandling) {
            hentSimulering(personTilBehandling);
        }
    }, [personTilBehandling]);

    const hentSimulering = sak => {
        return postSimulering(sak, authInfo.ident)
            .then(response => {
                setSimulering(response.data);
                return response.data;
            })
            .catch(err => {
                console.error(err);
                setError('Kunne ikke hente simulering');
            });
    };

    return (
        <SimuleringContext.Provider
            value={{
                simulering,
                error
            }}
        >
            {children}
        </SimuleringContext.Provider>
    );
};

SimuleringProvider.propTypes = {
    children: PropTypes.node.isRequired
};
