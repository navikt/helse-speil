import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { postSimulering } from '../io/http';
import { AuthContext } from './AuthContext';
import { PersonContext } from './PersonContext';
import { ProviderProps, Vedtaksperiode, Utbetalingsdato, Utbetalingsperiode } from './types';

interface Simulering {
    status: string;
    feilMelding: string;
    simulering: {
        gjelderId: string;
        totalBelop: number;
        gjelderNavn: string;
        periodeList: Utbetalingsperiode[];
        datoBeregnet: Utbetalingsdato;
    };
}

interface SimuleringContextType {
    simulering?: Simulering;
    arbeidsgiver?: string;
    error?: string;
}

export const SimuleringContext = createContext<SimuleringContextType>({});

export const SimuleringProvider = ({ children }: ProviderProps) => {
    const { personTilBehandling } = useContext(PersonContext);
    const { authInfo } = useContext(AuthContext);
    const [error, setError] = useState<string | undefined>(undefined);
    const [simulering, setSimulering] = useState(undefined);
    const [arbeidsgiver, setArbeidsgiver] = useState(undefined);

    useEffect(() => {
        if (personTilBehandling) {
            hentSimulering(personTilBehandling.arbeidsgivere?.[0].saker?.[0]).then(simulering => {
                const arbeidsgiver =
                    simulering?.simulering?.periodeList[0]?.utbetaling[0].detaljer[0]
                        .refunderesOrgNr;
                setArbeidsgiver(arbeidsgiver);
            });
        }
    }, [personTilBehandling]);

    const hentSimulering = async (sak: Vedtaksperiode) => {
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
