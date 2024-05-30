import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import { TextField } from '@navikt/ds-react';

import { toKronerOgØre } from '@utils/locale';

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
                    const endretEvent = formaterBeløp(e);
                    return årligField.onChange(endretEvent);
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

const formaterBeløp = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') return e;
    const splittetInput = e.target.value.split(',');
    const kronebeløpUtenDesimaler = toKronerOgØre(splittetInput[0].replace(/\s/g, ''), 0);
    const caretStart = (e.target?.selectionStart ?? 0) - (splittetInput[0].length - kronebeløpUtenDesimaler.length);
    const caretEnd = (e.target?.selectionEnd ?? 0) - (splittetInput[0].length - kronebeløpUtenDesimaler.length);

    e.target.value = kronebeløpUtenDesimaler + (splittetInput.length > 1 ? `,${splittetInput[1]}` : '');
    e.target.setSelectionRange(caretStart, caretEnd);

    return e;
};
