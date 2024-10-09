import React from 'react';

import { ErrorSummary } from '@navikt/ds-react';

export interface Skjemafeil {
    id: string;
    melding: string;
}

interface FeiloppsummeringProps {
    feiloppsummeringRef?: React.Ref<HTMLDivElement>;
    feilliste: Skjemafeil[];
}

export const Feiloppsummering = ({ feiloppsummeringRef, feilliste }: FeiloppsummeringProps) => (
    <ErrorSummary ref={feiloppsummeringRef} heading="Skjemaet inneholder følgende feil:" size="small">
        {feilliste.map((feil, index) => (
            <ErrorSummary.Item href={`#${feil.id}`} key={index}>
                {feil.melding}
            </ErrorSummary.Item>
        ))}
    </ErrorSummary>
);
