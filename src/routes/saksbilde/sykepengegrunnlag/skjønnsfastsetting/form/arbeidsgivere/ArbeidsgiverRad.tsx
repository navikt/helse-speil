import React, { useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import { Table, TextField } from '@navikt/ds-react';

import { Arbeidsgivernavn } from '@saksbilde/sykepengegrunnlag/Arbeidsgivernavn';
import styles from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/form/skjønnsfastsettingForm/SkjønnsfastsettingForm.module.css';
import { Skjønnsfastsettingstype } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/skjønnsfastsetting';
import { toKronerOgØre } from '@utils/locale';

interface ArbeidsgiverRadProps {
    arbeidsgiverNavn?: string;
    type?: Skjønnsfastsettingstype;
    årligField: UseFormRegisterReturn;
    orgnummerField: UseFormRegisterReturn;
    antallArbeidsgivere: number;
    setÅrligFieldValue: (value: number) => void;
    clearArbeidsgiverErrors: () => void;
}

export const ArbeidsgiverRad = ({
    arbeidsgiverNavn,
    type,
    årligField,
    orgnummerField,
    antallArbeidsgivere,
    setÅrligFieldValue,
    clearArbeidsgiverErrors,
}: ArbeidsgiverRadProps) => {
    const [visningsverdi, setVisningsverdi] = useState('0');
    return (
        <Table.Row className={styles.arbeidsgiver}>
            <Table.DataCell>
                <Arbeidsgivernavn arbeidsgivernavn={arbeidsgiverNavn} className={styles.arbeidsgivernavn} />
            </Table.DataCell>
            <Table.DataCell>
                <TextField
                    {...årligField}
                    value={visningsverdi}
                    onChange={(e) => {
                        setVisningsverdi(e.target.value);
                    }}
                    onBlur={(e) => {
                        const nyttBeløp = Number(
                            e.target.value
                                .replaceAll(' ', '')
                                .replaceAll(',', '.')
                                // Når tallet blir formattert av toKronerOgØre får det non braking space i stedet for ' '
                                .replaceAll(String.fromCharCode(160), ''),
                        );
                        setVisningsverdi(Number.isNaN(nyttBeløp) ? e.target.value : toKronerOgØre(nyttBeløp));
                        clearArbeidsgiverErrors();
                        setÅrligFieldValue(nyttBeløp);
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
            </Table.DataCell>
        </Table.Row>
    );
};
