import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorModal from '../components/ErrorModal';
import { fetchSaksoversikt, getPersoninfo } from '../io/http';

export const SaksoversiktContext = createContext();

const appendPersoninfo = behov => {
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

export const SaksoversiktProvider = ({ children }) => {
    const [error, setError] = useState(undefined);
    const [saksoversikt, setSaksoversikt] = useState([]);
    const [isFetchingSaksoversikt, setIsFetchingSaksoversikt] = useState(false);
    const [isFetchingPersoninfo, setIsFetchingPersoninfo] = useState(false);

    const hentSaksoversikt = async () => {
        const oversikt = await hentPersoner();
        setSaksoversikt(oversikt);
        setIsFetchingPersoninfo(true);
        const oversiktWithPersoninfo = await Promise.all(
            oversikt.map(behandling => appendPersoninfo(behandling))
        ).finally(() => setIsFetchingPersoninfo(false));
        if (oversiktWithPersoninfo.find(behandling => behandling.personinfo === undefined)) {
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
