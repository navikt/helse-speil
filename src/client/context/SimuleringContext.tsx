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

export interface Simulering {
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

export const SimuleringProvider = ({ children }: ProviderProps) => {
    const { personTilBehandling, aktivVedtaksperiode } = useContext(PersonContext);
    const { authInfo } = useContext(AuthContext);
    const [error, setError] = useState<string | undefined>(undefined);
    const [simulering, setSimulering] = useState<Simulering | undefined>(undefined);
    const [arbeidsgiver, setArbeidsgiver] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (aktivVedtaksperiode) {
            setError(undefined);
            setSimulering(undefined);
            setArbeidsgiver(undefined);
            if (!aktivVedtaksperiode.godkjentAv) {
                hentSimulering(aktivVedtaksperiode.rawData);
            }
        }
    }, [aktivVedtaksperiode]);

    const hentSimulering = async (vedtaksperiode: SpleisVedtaksperiode): Promise<void> => {
        if (!personTilBehandling) return;

        const sammeUtbetalingsreferanse = (periode: Vedtaksperiode) =>
            periode.utbetalingsreferanse === vedtaksperiode.utbetalingsreferanse;

        const erUtvidelse =
            personTilBehandling.arbeidsgivere[0].vedtaksperioder.filter(sammeUtbetalingsreferanse).length > 1;

        try {
            const { data }: { data: SimuleringResponse } = await postSimulering(
                vedtaksperiode,
                personTilBehandling!.aktørId,
                personTilBehandling!.arbeidsgivere[0].organisasjonsnummer,
                personTilBehandling!.fødselsnummer,
                erUtvidelse,
                authInfo.ident
            );
            if (data.status === 'FEIL') {
                setError(data.feilMelding);
            } else if (!data.simulering) {
                throw Error('Mangler simulering i svar fra backend');
            } else {
                setSimulering(data.simulering);
                const arbeidsgiver = data.simulering.periodeList[0]?.utbetaling[0].detaljer[0].refunderesOrgNr;
                setArbeidsgiver(arbeidsgiver);
            }
        } catch (err) {
            console.error(err);
            setError('Kunne ikke hente simulering');
        }
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
