import React, { createContext, useMemo, useState } from 'react';
import { deleteTildeling, getTildelinger, postTildeling } from '../io/http';
import { ProviderProps, Tildeling } from './types.internal';
import { Oppgave } from '../../types';
import { capitalizeName, extractNameFromEmail } from '../utils/locale';

interface TildelingerContextType {
    tildelinger: Tildeling[];
    isFetching: boolean;
    tildelOppgave: (oppgavereferanse: string, userId: string) => Promise<void>;
    fetchTildelinger: (oppgaver: Oppgave[]) => void;
    fjernTildeling: (oppgavereferanse: string) => void;
    tildelingError?: string;
}

export const TildelingerContext = createContext<TildelingerContextType>({
    tildelinger: [],
    isFetching: false,
    tildelOppgave: (_oppgavereferanse, _userId) => Promise.resolve(),
    fetchTildelinger: (_oppgaver) => {},
    fjernTildeling: (_oppgavereferanse: string) => {},
});

export const TildelingerProvider = ({ children }: ProviderProps) => {
    const [tildelinger, setTildelinger] = useState<Tildeling[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const tildelOppgave = (oppgavereferanse: string, userId: string) => {
        return postTildeling({ oppgavereferanse, userId })
            .then(() => {
                setTildelinger((prev) =>
                    prev.map((tildeling) =>
                        tildeling.oppgavereferanse === oppgavereferanse ? { oppgavereferanse, userId } : tildeling
                    )
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

    const fetchTildelinger = (oppgaver: Oppgave[]) => {
        if (oppgaver.length > 0) {
            const oppgavereferanser = oppgaver.map((b) => b.oppgavereferanse);

            let limit = 500;
            let i = 0,
                n = oppgavereferanser.length;

            // Start med blanke ark for å unngå appending
            setTildelinger([]);
            setIsFetching(true);
            const fetches = [];
            while (i < n) {
                const aFetch = getTildelinger(oppgavereferanser.slice(i, (i += limit)))
                    .then((result) => {
                        const nyeTildelinger = result.data;
                        setTildelinger((prev) => [...prev, ...nyeTildelinger]);
                    })
                    .catch((err) => {
                        setError('Kunne ikke hente tildelingsinformasjon.');
                        console.error(err);
                    });
                fetches.push(aFetch);
            }
            Promise.allSettled(fetches).then(() => {
                setIsFetching(false);
            });
        }
    };

    const fjernTildeling = (oppgavereferanse: string) => {
        deleteTildeling(oppgavereferanse)
            .then(() => {
                setTildelinger((prev) =>
                    prev.map((tildeling) =>
                        tildeling.oppgavereferanse === oppgavereferanse
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
            isFetching,
            tildelOppgave,
            tildelingError: error,
            fetchTildelinger,
            fjernTildeling,
        }),
        [tildelinger, isFetching, error]
    );

    return <TildelingerContext.Provider value={value}>{children}</TildelingerContext.Provider>;
};
