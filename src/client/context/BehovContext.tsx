import React, { createContext, ReactChild, useState } from 'react';
import { fetchBehov } from '../io/http';
import { Oppgave } from '../../types';

interface Error {
    message: string;
    statusCode?: number;
}

interface ProviderProps {
    children: ReactChild | ReactChild[];
}

interface BehovoversiktContextType {
    behov: Oppgave[];
    hentBehov: () => Promise<Oppgave[]>;
    isFetchingBehov: boolean;
    error?: Error;
}

export const BehovContext = createContext<BehovoversiktContextType>({
    behov: [],
    hentBehov: () => Promise.resolve([]),
    isFetchingBehov: false,
});

export const BehovProvider = ({ children }: ProviderProps) => {
    const [error, setError] = useState<Error | undefined>();
    const [behov, setBehov] = useState<Oppgave[]>([]);
    const [isFetchingBehov, setIsFetchingBehov] = useState(false);

    const hentBehov = () => {
        setIsFetchingBehov(true);
        return fetchBehov()
            .then((response) => {
                setBehov(response.data.behov);
                return response.data.behov;
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
                return setBehov([]);
            })
            .finally(() => setIsFetchingBehov(false));
    };

    return (
        <BehovContext.Provider value={{ behov, hentBehov, isFetchingBehov, error }}>{children}</BehovContext.Provider>
    );
};
