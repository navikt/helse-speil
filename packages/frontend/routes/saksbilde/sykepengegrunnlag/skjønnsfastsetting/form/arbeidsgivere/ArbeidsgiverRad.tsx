import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import { TextField } from '@navikt/ds-react';

import { Arbeidsgivernavn } from '../../../Arbeidsgivernavn';
import { Skjønnsfastsettingstype } from '../../skjønnsfastsetting';

import styles from '../SkjønnsfastsettingForm/SkjønnsfastsettingForm.module.css';

interface ArbeidsgiverRadProps {
    arbeidsgiverNavn?: string;
    type: Skjønnsfastsettingstype;
    årligField: UseFormRegisterReturn;
    orgnummerField: UseFormRegisterReturn;
    antallArbeidsgivere: number;
    clearArbeidsgiverErrors: () => void;
}

export const ArbeidsgiverRad = ({
    arbeidsgiverNavn,
    type,
    årligField,
    orgnummerField,
    antallArbeidsgivere,
    clearArbeidsgiverErrors,
}: ArbeidsgiverRadProps) => (
    <tr className={styles.arbeidsgiver}>
        <td>
            <Arbeidsgivernavn arbeidsgivernavn={arbeidsgiverNavn} className={styles.arbeidsgivernavn} />
        </td>
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
                disabled={
                    type === Skjønnsfastsettingstype.OMREGNET_ÅRSINNTEKT ||
                    (type === Skjønnsfastsettingstype.RAPPORTERT_ÅRSINNTEKT && antallArbeidsgivere <= 1)
                }
                className={styles.arbeidsgiverInput}
                onFocus={(e) => e.target.select()}
            />
            <input {...orgnummerField} hidden style={{ display: 'none' }} />
        </td>
    </tr>
);
