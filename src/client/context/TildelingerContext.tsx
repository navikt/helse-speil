import React, { createContext, useMemo, useState } from 'react';
import { deleteTildeling, getTildelinger, postTildeling } from '../io/http';
import { ProviderProps, Tildeling } from './types.internal';
import { Oppgave } from '../../types';
import { capitalizeName, extractNameFromEmail } from '../utils/locale';
import { useUpdateVarsler } from '../state/varslerState';
import { Varseltype } from '@navikt/helse-frontend-varsel';

interface TildelingerContextType {
    tildelinger: Tildeling[];
    isFetching: boolean;
    tildelOppgave: (oppgavereferanse: string, userId: string) => Promise<void>;
    fetchTildelinger: (oppgaver: Oppgave[]) => void;
    fjernTildeling: (oppgavereferanse: string) => void;
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
    const { leggTilVarsel, fjernVarsler } = useUpdateVarsler();

    const tildelOppgave = (oppgavereferanse: string, userId: string) => {
        fjernVarsler();
        return postTildeling({ oppgavereferanse, userId })
            .then(() => {
                setTildelinger((prev) =>
                    prev.map((tildeling) =>
                        tildeling.oppgavereferanse === oppgavereferanse ? { oppgavereferanse, userId } : tildeling
                    )
                );
            })
            .catch((error) => {
                let assignedUser;
                try {
                    assignedUser = JSON.parse(error.message).alreadyAssignedTo;
                } catch {
                    assignedUser = error.message?.alreadyAssignedTo;
                }
                if (assignedUser) {
                    leggTilVarsel({
                        message: `${capitalizeName(extractNameFromEmail(assignedUser))} har allerede tatt saken.`,
                        type: Varseltype.Advarsel,
                    });
                } else {
                    leggTilVarsel({ message: 'Kunne ikke tildele sak.', type: Varseltype.Advarsel });
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
                        leggTilVarsel({
                            message: 'Kunne ikke hente tildelingsinformasjon.',
                            type: Varseltype.Advarsel,
                        });
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
        fjernVarsler();
        deleteTildeling(oppgavereferanse)
            .then(() => {
                setTildelinger((prev) =>
                    prev.map((tildeling) =>
                        tildeling.oppgavereferanse === oppgavereferanse
                            ? (({ ...tildeling, userId: null } as unknown) as Tildeling)
                            : tildeling
                    )
                );
            })
            .catch((error) => {
                leggTilVarsel({ message: 'Kunne ikke fjerne tildeling av sak.', type: Varseltype.Advarsel });
                console.error(error);
            });
    };

    const value = useMemo(
        () => ({
            tildelinger,
            isFetching,
            tildelOppgave,
            fetchTildelinger,
            fjernTildeling,
        }),
        [tildelinger, isFetching]
    );

    return <TildelingerContext.Provider value={value}>{children}</TildelingerContext.Provider>;
};
