import React, { createContext, useContext, useEffect, useState } from 'react';
import { postSimulering } from '../io/http';
import { AuthContext } from './AuthContext';
import { PersonContext } from './PersonContext';
import { ProviderProps, SpleisVedtaksperiode, Utbetalingsperiode, Vedtaksperiode } from './types';

interface SimuleringResponse {
    status: string;
    feilMelding: string;
    simulering: Simulering;
}

interface Simulering {
    gjelderId: string;
    totalBelop: number;
    gjelderNavn: string;
    periodeList: Utbetalingsperiode[];
    datoBeregnet: string;
}

interface SimuleringContextType {
    simulering?: Simulering;
    arbeidsgiver?: string;
    error?: string;
}

export const SimuleringContext = createContext<SimuleringContextType>({});

/**
 * Hack warning
 *
 * Fordi Spleis setter første fraværsdag som FOM på utbetalingslinjer må vi korrigere ved å sette
 * riktig FOM før vi kaller Spenn.
 */
const korrigérVedtaksperiodeForSimulering = ({
    fom,
    rawData
}: Vedtaksperiode): SpleisVedtaksperiode => {
    const korrigerteUtbetalingslinjer = rawData.utbetalingslinjer?.map(linje => ({
        ...linje,
        fom
    }));
    return { ...rawData, utbetalingslinjer: korrigerteUtbetalingslinjer };
};

export const SimuleringProvider = ({ children }: ProviderProps) => {
    const { personTilBehandling, aktivVedtaksperiode } = useContext(PersonContext);
    const { authInfo } = useContext(AuthContext);
    const [error, setError] = useState<string | undefined>(undefined);
    const [simulering, setSimulering] = useState<Simulering | undefined>(undefined);
    const [arbeidsgiver, setArbeidsgiver] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (aktivVedtaksperiode) {
            hentSimulering(korrigérVedtaksperiodeForSimulering(aktivVedtaksperiode)).then(data => {
                const arbeidsgiver =
                    data?.simulering?.periodeList[0]?.utbetaling[0].detaljer[0].refunderesOrgNr;
                setArbeidsgiver(arbeidsgiver);
            });
        }
    }, [aktivVedtaksperiode]);

    const hentSimulering = async (vedtaksperiode: SpleisVedtaksperiode) => {
        const erUtvidelse =
            (
                personTilBehandling?.arbeidsgivere[0].vedtaksperioder.map(
                    periode => periode.utbetalingsreferanse === vedtaksperiode.utbetalingsreferanse
                ) || []
            ).length > 1;
        return await postSimulering(
            vedtaksperiode,
            personTilBehandling!.aktørId,
            personTilBehandling!.arbeidsgivere[0].organisasjonsnummer,
            personTilBehandling!.fødselsnummer,
            erUtvidelse,
            authInfo.ident
        )
            .then((response: { data: SimuleringResponse }) => {
                if (response.data.status === 'FEIL') {
                    setError(response.data.feilMelding);
                } else {
                    setSimulering(response.data.simulering);
                }
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
