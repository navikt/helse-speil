import React from 'react';

import { ErrorSummary } from '@navikt/ds-react';

import styles from './EditableInntekt.module.css';

export interface Skjemafeil {
    id: string;
    melding: string;
}

interface FeiloppsummeringProps {
    feiloppsummeringRef?: React.Ref<HTMLDivElement>;
    feilliste: Skjemafeil[];
}

export const Feiloppsummering = ({ feiloppsummeringRef, feilliste }: FeiloppsummeringProps) => (
    <div className={styles.Feiloppsummering}>
        <ErrorSummary
            ref={feiloppsummeringRef}
            heading="Skjemaet inneholder følgende feil:"
            className={styles.Feiloppsummering}
        >
            {feilliste.map((feil, index) => (
                <ErrorSummary.Item href={`#${feil.id}`} key={index}>
                    {feil.melding}
                </ErrorSummary.Item>
            ))}
        </ErrorSummary>
    </div>
);
