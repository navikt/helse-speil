import React, { createContext, ReactChild, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorModal from '../components/ErrorModal';
import { fetchBehovoversikt } from '../io/http';
import { Oppgave } from '../../types';

interface Error {
    message: string;
    statusCode?: number;
}

interface ProviderProps {
    children: ReactChild | ReactChild[];
}

interface BehovoversiktContextType {
    behovoversikt: Oppgave[];
    hentBehovoversikt: () => void;
    isFetchingBehovoversikt: boolean;
}

export const SaksoversiktContext = createContext<BehovoversiktContextType>({
    behovoversikt: [],
    hentBehovoversikt: () => {},
    isFetchingBehovoversikt: false
});

export const BehovoversiktProvider = ({ children }: ProviderProps) => {
    const [error, setError] = useState<Error | undefined>(undefined);
    const [behovoversikt, setBehovoversikt] = useState<Oppgave[]>([]);
    const [isFetchingBehovoversikt, setIsFetchingBehovoversikt] = useState(false);

    const hentBehovoversikt = async () => {
        const oversikt: Oppgave[] = await hentBehov();
        setBehovoversikt(oversikt);
    };

    const hentBehov = () => {
        setIsFetchingBehovoversikt(true);
        return fetchBehovoversikt()
            .then(response => response.data.behov)
            .catch(err => {
                if (!err.statusCode) console.error(err);
                if (err.statusCode !== 401) {
                    const message =
                        err.statusCode === 404
                            ? 'Fant ingen saker mellom i går og i dag.'
                            : 'Kunne ikke hente saker. Prøv igjen senere.';
                    setError({ ...err, message });
                }
                return [];
            })
            .finally(() => setIsFetchingBehovoversikt(false));
    };

    return (
        <SaksoversiktContext.Provider
            value={{
                behovoversikt: behovoversikt,
                hentBehovoversikt: hentBehovoversikt,
                isFetchingBehovoversikt: isFetchingBehovoversikt
            }}
        >
            {children}
            {error && (
                <ErrorModal
                    errorMessage={error.message}
                    onClose={error.statusCode !== 401 ? () => setError(undefined) : undefined}
                />
            )}
        </SaksoversiktContext.Provider>
    );
};

BehovoversiktProvider.propTypes = {
    children: PropTypes.node.isRequired
};
