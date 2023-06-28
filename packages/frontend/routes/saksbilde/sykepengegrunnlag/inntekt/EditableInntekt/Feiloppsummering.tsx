import React from 'react';
import { FieldErrors } from 'react-hook-form';

import { ErrorSummary } from '@navikt/ds-react';

import styles from './EditableInntekt.module.css';

interface FeiloppsummeringProps {
    feiloppsummeringRef?: React.Ref<HTMLDivElement>;
    errors: FieldErrors;
}

export const Feiloppsummering = ({ feiloppsummeringRef, errors }: FeiloppsummeringProps) => {
    const feilListe = Object.entries(errors)
        .filter(([id]) => id !== 'refusjonsopplysninger')
        .map(([id, error]) => {
            return {
                id: error?.type === 'refusjonsopplysninger' ? 'refusjonsopplysninger' : id,
                message: (error?.message as string) ?? id,
            };
        });
    return (
        <ErrorSummary
            ref={feiloppsummeringRef}
            heading="Skjemaet inneholder følgende feil:"
            className={styles.Feiloppsummering}
        >
            {feilListe.map((feil, index) => (
                <ErrorSummary.Item href={`#${feil.id}`} key={index}>
                    {feil.message}
                </ErrorSummary.Item>
            ))}
        </ErrorSummary>
    );
};
