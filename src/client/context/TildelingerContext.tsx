import React, { createContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { deleteTildeling, getTildelinger, postTildeling } from '../io/http';
import { ProviderProps, Tildeling } from './types.internal';
import { Oppgave } from '../../types';
import { capitalizeName, extractNameFromEmail } from '../utils/locale';

interface TildelingerContextType {
    tildelinger: Tildeling[];
    tildelBehandling: (behovId: string, userId: string) => Promise<void>;
    fetchTildelinger: (saksoversikt: Oppgave[]) => void;
    fjernTildeling: (behovId: string) => void;
    tildelingError?: string;
}

export const TildelingerContext = createContext<TildelingerContextType>({
    tildelinger: [],
    tildelBehandling: (_behovId, _userId) => Promise.resolve(),
    fetchTildelinger: (_saksoversikt) => {},
    fjernTildeling: (_behovId: string) => {},
});

export const TildelingerProvider = ({ children }: ProviderProps) => {
    const [tildelinger, setTildelinger] = useState<Tildeling[]>([]);
    const [error, setError] = useState<string | undefined>(undefined);

    const tildelBehandling = (behovId: string, userId: string) => {
        return postTildeling({ behovId, userId })
            .then(() => {
                setTildelinger((prev) =>
                    prev.map((tildeling) => (tildeling.behovId === behovId ? { behovId, userId } : tildeling))
                );
                setError(undefined);
            })
            .catch((error) => {
                let assignedUser;
                try {
                    assignedUser = JSON.parse(error.message).alreadyAssignedTo;
                } catch {
                    assignedUser = error.message?.alreadyAssignedTo;
                }
                if (assignedUser) {
                    setError(`${capitalizeName(extractNameFromEmail(assignedUser))} har allerede tatt saken.`);
                } else {
                    setError('Kunne ikke tildele sak.');
                }
                return Promise.reject();
            });
    };

    const fetchTildelinger = (saksoversikt: Oppgave[]) => {
        if (saksoversikt.length > 0) {
            const behovIds = saksoversikt.map((b) => b.spleisbehovId);

            let limit = 500;
            let i = 0,
                n = behovIds.length;

            // Start med blanke ark for å unngå appending
            setTildelinger([]);
            while (i < n) {
                getTildelinger(behovIds.slice(i, (i += limit)))
                    .then((result) => {
                        const nyeTildelinger = result.data;
                        setTildelinger((prev) => [...prev, ...nyeTildelinger]);
                    })
                    .catch((err) => {
                        setError('Kunne ikke hente tildelingsinformasjon.');
                        console.error(err);
                    });
            }
        }
    };

    const fjernTildeling = (behovId: string) => {
        deleteTildeling(behovId)
            .then(() => {
                setTildelinger((prev) =>
                    prev.map((tildeling) =>
                        tildeling.behovId === behovId
                            ? (({ ...tildeling, userId: null } as unknown) as Tildeling)
                            : tildeling
                    )
                );
                setError(undefined);
            })
            .catch((error) => {
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
            fjernTildeling,
        }),
        [tildelinger, error]
    );

    return <TildelingerContext.Provider value={value}>{children}</TildelingerContext.Provider>;
};

TildelingerProvider.propTypes = {
    children: PropTypes.node,
};
