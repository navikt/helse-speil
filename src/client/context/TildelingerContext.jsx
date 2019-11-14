import React, { createContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { deleteTildeling, getTildelinger, postTildeling } from '../io/http';

export const TildelingerContext = createContext({});

export const TildelingerProvider = ({ children }) => {
    const [tildelinger, setTildelinger] = useState([]);
    const [error, setError] = useState();

    const tildelBehandling = (behovId, userId) => {
        postTildeling({ behovId, userId })
            .then(() => {
                setTildelinger(t => [...t, { behandlingsId: behovId, userId }]);
                setError(undefined);
            })
            .catch(error => {
                const assignedUser = error.message?.alreadyAssignedTo;
                if (assignedUser) {
                    setError(`Saken er allerede tildelt til ${assignedUser}`);
                } else {
                    setError('Kunne ikke tildele sak.');
                }
            });
    };

    const fetchTildelinger = saksoversikt => {
        if (saksoversikt.length > 0) {
            const behovIds = saksoversikt.map(b => b['@id']);
            getTildelinger(behovIds)
                .then(result => {
                    const nyeTildelinger = result.data.filter(
                        behovId => behovId.userId !== undefined
                    );
                    setTildelinger(nyeTildelinger);
                })
                .catch(err => {
                    setError('Kunne ikke hente tildelingsinformasjon.');
                    console.error(err);
                });
        }
    };

    const fjernTildeling = behandlingsId => {
        deleteTildeling(behandlingsId)
            .then(() => {
                setTildelinger(tildelinger.filter(t => t.behandlingsId !== behandlingsId));
                setError(undefined);
            })
            .catch(error => {
                setError('Kunne ikke fjerne tildeling av sak.');
                console.error(error);
            });
    };

    const value = useMemo(
        () => ({
            tildelinger,
            tildelBehandling,
            tildelingError: error,
            fetchTildelinger,
            fjernTildeling
        }),
        [tildelinger, error]
    );

    return <TildelingerContext.Provider value={value}>{children}</TildelingerContext.Provider>;
};

TildelingerProvider.propTypes = {
    children: PropTypes.node
};
