import React, { createContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { deleteTildeling, getTildelinger, postTildeling } from '../io/http';
import { ProviderProps, Tildeling } from './types';
import { Behov } from '../../types';

interface TildelingerContextType {
    tildelinger: Tildeling[];
    tildelBehandling: (behovId: string, userId: string) => void;
    fetchTildelinger: (saksoversikt: Behov[]) => void;
    fjernTildeling: (behovId: string) => void;
    tildelingError?: string;
}

export const TildelingerContext = createContext<TildelingerContextType>({
    tildelinger: [],
    tildelBehandling: (behovId, userId) => {},
    fetchTildelinger: saksoversikt => {},
    fjernTildeling: (behovId: string) => {}
});

export const TildelingerProvider = ({ children }: ProviderProps) => {
    const [tildelinger, setTildelinger] = useState<Tildeling[]>([]);
    const [error, setError] = useState();

    const tildelBehandling = (behovId: string, userId: string) => {
        postTildeling({ behovId, userId })
            .then(() => {
                setTildelinger((t: Tildeling[]) =>
                    t.map(tildeling =>
                        tildeling.behovId === behovId ? { behovId, userId } : tildeling
                    )
                );
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

    const fetchTildelinger = (saksoversikt: Behov[]) => {
        if (saksoversikt.length > 0) {
            const behovIds = saksoversikt.map(b => b['@id']);
            getTildelinger(behovIds)
                .then(result => {
                    const nyeTildelinger = result.data.filter(
                        (tildeling: Tildeling) => tildeling.userId !== undefined
                    );
                    setTildelinger(nyeTildelinger);
                })
                .catch(err => {
                    setError('Kunne ikke hente tildelingsinformasjon.');
                    console.error(err);
                });
        }
    };

    const fjernTildeling = (behovId: string) => {
        deleteTildeling(behovId)
            .then(() => {
                setTildelinger(
                    tildelinger.filter((tildeling: Tildeling) => tildeling.behovId !== behovId)
                );
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
