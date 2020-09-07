import React, { createContext, ReactChild, useState } from 'react';
import { fetchOppgaver } from '../io/http';
import { Oppgave } from '../../types';

interface Error {
    message: string;
    statusCode?: number;
}

interface ProviderProps {
    children: ReactChild | ReactChild[];
}

interface OppgaveoversiktContextType {
    oppgaver: Oppgave[];
    hentOppgaver: () => void;
    markerOppgaveSomTildelt: (oppgave: Oppgave, email?: string) => void;
    isFetchingOppgaver: boolean;
    error?: Error;
}

export const OppgaverContext = createContext<OppgaveoversiktContextType>({
    oppgaver: [],
    hentOppgaver: () => {},
    markerOppgaveSomTildelt: () => undefined,
    isFetchingOppgaver: false,
});

export const OppgaverProvider = ({ children }: ProviderProps) => {
    const [error, setError] = useState<Error | undefined>();
    const [oppgaver, setOppgaver] = useState<Oppgave[]>([]);
    const [isFetchingOppgaver, setIsFetchingOppgaver] = useState(false);

    const hentOppgaver = () => {
        setIsFetchingOppgaver(true);
        fetchOppgaver()
            .then((response) => {
                setOppgaver(response.data.oppgaver);
                return response.data.oppgaver;
            })
            .catch((err) => {
                if (!err.statusCode) console.error(err);
                if (err.statusCode !== 401) {
                    const message =
                        err.statusCode === 404
                            ? 'Fant ingen saker mellom i går og i dag.'
                            : 'Kunne ikke hente saker. Prøv igjen senere.';
                    setError({ ...err, message });
                }
                return setOppgaver([]);
            })
            .finally(() => setIsFetchingOppgaver(false));
    };

    const markerOppgaveSomTildelt = (oppgave: Oppgave, email?: string) => {
        setOppgaver((prev) => {
            return prev.map((prevOppgave) => {
                if (oppgave === prevOppgave) return { ...prevOppgave, tildeltTil: email };
                else return prevOppgave;
            });
        });
    };

    return (
        <OppgaverContext.Provider
            value={{ oppgaver, hentOppgaver, markerOppgaveSomTildelt, isFetchingOppgaver, error }}
        >
            {children}
        </OppgaverContext.Provider>
    );
};
