import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { postSimulering } from '../io/http';
import { AuthContext } from './AuthContext';
import { PersonContext } from './PersonContext';

export const SimuleringContext = createContext();

export const SimuleringProvider = ({ children }) => {
    const { personTilBehandling } = useContext(PersonContext);
    const { authInfo } = useContext(AuthContext);
    const [error, setError] = useState(undefined);
    const [simulering, setSimulering] = useState(undefined);
    const [arbeidsgiver, setArbeidsgiver] = useState(undefined);

    useEffect(() => {
        if (personTilBehandling) {
            hentSimulering(personTilBehandling.arbeidsgivere?.[0].saker?.[0]).then(simulering =>
                setArbeidsgiver(
                    simulering?.simulering?.periodeList[0]?.utbetaling[0].detaljer[0]
                        .refunderesOrgNr
                )
            );
        }
    }, [personTilBehandling]);

    const hentSimulering = async sak => {
        return await postSimulering(sak, authInfo.ident)
            .then(response => {
                setSimulering(response.data);
                return response.data;
            })
            .catch(err => {
                console.error(err);
                setError('Kunne ikke hente simulering');
                return undefined;
            });
    };

    return (
        <SimuleringContext.Provider
            value={{
                simulering,
                arbeidsgiver,
                error
            }}
        >
            {children}
        </SimuleringContext.Provider>
    );
};

SimuleringProvider.propTypes = {
    children: PropTypes.node.isRequired
};
