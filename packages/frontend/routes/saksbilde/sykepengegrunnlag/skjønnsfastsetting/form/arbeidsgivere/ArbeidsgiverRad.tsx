import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import { TextField } from '@navikt/ds-react';

import { Arbeidsgivernavn } from '../../../Arbeidsgivernavn';

import styles from '../SkjønnsfastsettingForm/SkjønnsfastsettingForm.module.css';

interface ArbeidsgiverRadProps {
    arbeidsgiverNavn?: string;
    begrunnelseId: string;
    arbeidsgiversammenligningsgrunnlag?: number;
    årligField: UseFormRegisterReturn;
    orgnummerField: UseFormRegisterReturn;
    antallArbeidsgivere: number;
    clearArbeidsgiverErrors: () => void;
}

export const ArbeidsgiverRad = ({
    arbeidsgiverNavn,
    begrunnelseId,
    arbeidsgiversammenligningsgrunnlag,
    årligField,
    orgnummerField,
    antallArbeidsgivere,
    clearArbeidsgiverErrors,
}: ArbeidsgiverRadProps) => (
    <tr className={styles.arbeidsgiver}>
        <td>
            <Arbeidsgivernavn arbeidsgivernavn={arbeidsgiverNavn} className={styles.arbeidsgivernavn} />
        </td>
        {begrunnelseId === '1' && (
            <td>
                <TextField
                    label="Rapportert årsinntekt"
                    hideLabel
                    size="small"
                    disabled
                    value={arbeidsgiversammenligningsgrunnlag}
                    className={styles.arbeidsgiverInput}
                />
            </td>
        )}
        <td>
            <TextField
                {...årligField}
                onChange={(e) => {
                    clearArbeidsgiverErrors();
                    return årligField.onChange(e);
                }}
                size="small"
                label="Skjønnsfastsatt årlig inntekt"
                hideLabel
                type="text"
                inputMode="numeric"
                disabled={begrunnelseId === '0' || (begrunnelseId === '1' && antallArbeidsgivere <= 1)}
                className={styles.arbeidsgiverInput}
            />
            <input {...orgnummerField} hidden style={{ display: 'none' }} />
        </td>
    </tr>
);
