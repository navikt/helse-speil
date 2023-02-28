import React from 'react';

import { Simuleringsutbetaling } from '@io/graphql';
import { getFormattedDateString } from '@utils/date';

import { SimuleringsperiodeValue } from './SimuleringsperiodeValue';

interface SimuleringsutbetalingViewProps {
    utbetaling: Simuleringsutbetaling;
}

export const SimuleringsutbetalingView: React.FC<SimuleringsutbetalingViewProps> = ({ utbetaling }) => {
    return (
        <>
            <SimuleringsperiodeValue label="Utbetales til ID" value={utbetaling.mottakerId} />
            <SimuleringsperiodeValue label="Utbetales til navn" value={utbetaling.mottakerNavn} />
            <SimuleringsperiodeValue label="Forfall" value={getFormattedDateString(utbetaling.forfall)} />
            <SimuleringsperiodeValue label="Feilkonto" value={utbetaling.feilkonto ? 'Ja' : 'Nei'} />
            {utbetaling.detaljer.map((detalj, i) => (
                <React.Fragment key={i}>
                    <SimuleringsperiodeValue label="Faktisk fom" value={getFormattedDateString(detalj.fom)} />
                    <SimuleringsperiodeValue label="Faktisk tom" value={getFormattedDateString(detalj.tom)} />
                    <SimuleringsperiodeValue label="Sats" value={detalj.sats} />
                    <SimuleringsperiodeValue label="Antall sats" value={String(detalj.antallSats)} />
                    <SimuleringsperiodeValue label="Type sats" value={detalj.typeSats} />
                    <SimuleringsperiodeValue label="Beløp" value={detalj.belop} />
                    <SimuleringsperiodeValue label="Konto" value={detalj.konto} />
                    <SimuleringsperiodeValue label="Klassekode" value={detalj.klassekode} />
                    <SimuleringsperiodeValue label="Klassekodebeskrivelse" value={detalj.klassekodebeskrivelse} />
                    <SimuleringsperiodeValue label="Uføregrad" value={`${detalj.uforegrad} %`} />
                    <SimuleringsperiodeValue label="Utbetalingstype" value={detalj.utbetalingstype} />
                    <SimuleringsperiodeValue label="Refunderes orgnummer" value={detalj.refunderesOrgNr} />
                    <SimuleringsperiodeValue label="Tilbakeføring" value={detalj.tilbakeforing ? 'Ja' : 'Nei'} />
                </React.Fragment>
            ))}
        </>
    );
};
