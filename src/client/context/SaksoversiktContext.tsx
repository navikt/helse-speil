import React, { createContext, ReactChild, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorModal from '../components/ErrorModal';
import { fetchSaksoversikt, getPersoninfo } from '../io/http';
import { Optional } from './types';
import { Behov } from '../../types';

interface Error {
    message: string;
    statusCode?: number;
}

interface ProviderProps {
    children: ReactChild | ReactChild[];
}

interface SaksoversiktContextType {
    saksoversikt: Behov[];
    hentSaksoversikt: () => void;
    isFetchingSaksoversikt: boolean;
    isFetchingPersoninfo: boolean;
}

export const SaksoversiktContext = createContext<SaksoversiktContextType>({
    saksoversikt: [],
    hentSaksoversikt: () => {},
    isFetchingSaksoversikt: false,
    isFetchingPersoninfo: false
});

const appendPersoninfo = (behov: Behov) => {
    return getPersoninfo(behov.aktørId)
        .then(response => ({
            ...behov,
            personinfo: { ...response.data }
        }))
        .catch(err => {
            console.error('Feil ved henting av person.', err);
            return behov;
        });
};

export const SaksoversiktProvider = ({ children }: ProviderProps) => {
    const [error, setError] = useState<Optional<Error>>(undefined);
    const [saksoversikt, setSaksoversikt] = useState<Behov[]>([]);
    const [isFetchingSaksoversikt, setIsFetchingSaksoversikt] = useState(false);
    const [isFetchingPersoninfo, setIsFetchingPersoninfo] = useState(false);

    const hentSaksoversikt = async () => {
        const oversikt: Behov[] = await hentPersoner();
        setSaksoversikt(oversikt);
        setIsFetchingPersoninfo(true);
        const oversiktWithPersoninfo: Behov[] = await Promise.all(
            oversikt.map((behandling: Behov) => appendPersoninfo(behandling))
        ).finally(() => setIsFetchingPersoninfo(false));
        const finnesBehovUtenPersoninfo = oversiktWithPersoninfo.find(
            (behandling: Behov) => behandling.personinfo === undefined
        );
        if (finnesBehovUtenPersoninfo) {
            setError({ message: 'Kunne ikke hente navn for en eller flere saker. Viser aktørId' });
        }
        setSaksoversikt(oversiktWithPersoninfo);
    };

    const hentPersoner = () => {
        setIsFetchingSaksoversikt(true);
        return fetchSaksoversikt()
            .then(response => response.data.behov)
            .catch(err => {
                setError({
                    ...err,
                    message:
                        err.statusCode === 401
                            ? 'Du må logge inn på nytt'
                            : err.statusCode === 404
                            ? 'Fant ingen behandlinger mellom i går og i dag.'
                            : 'Kunne ikke hente behandlinger. Prøv igjen senere.'
                });
                return [];
            })
            .finally(() => setIsFetchingSaksoversikt(false));
    };

    return (
        <SaksoversiktContext.Provider
            value={{
                saksoversikt,
                hentSaksoversikt,
                isFetchingSaksoversikt,
                isFetchingPersoninfo
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

SaksoversiktProvider.propTypes = {
    children: PropTypes.node.isRequired
};
