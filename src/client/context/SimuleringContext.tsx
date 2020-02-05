import React, { createContext, useContext, useEffect, useState } from 'react';
import { postSimulering } from '../io/http';
import { AuthContext } from './AuthContext';
import { PersonContext } from './PersonContext';
import { ProviderProps, Utbetalingsdato, Utbetalingsperiode, Vedtaksperiode } from './types';
import { enesteArbeidsgiver, enesteVedtaksperiode } from './mapper';

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
            hentSimulering(enesteVedtaksperiode(personTilBehandling)).then(simulering => {
                const arbeidsgiver =
                    simulering?.simulering?.periodeList[0]?.utbetaling[0].detaljer[0]
                        .refunderesOrgNr;
                setArbeidsgiver(arbeidsgiver);
            });
        }
    }, [personTilBehandling]);

    const hentSimulering = async (vedtaksperiode: Vedtaksperiode) => {
        return await postSimulering(
            vedtaksperiode,
            personTilBehandling!.aktørId,
            enesteArbeidsgiver(personTilBehandling!).organisasjonsnummer,
            authInfo.ident
        )
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
