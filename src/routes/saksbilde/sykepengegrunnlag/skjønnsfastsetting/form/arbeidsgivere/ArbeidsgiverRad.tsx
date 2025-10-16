import React, { useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import { HStack, Table, TextField } from '@navikt/ds-react';

import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import styles from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/form/skjønnsfastsettingForm/SkjønnsfastsettingForm.module.css';
import { Skjønnsfastsettingstype } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/skjønnsfastsetting';
import { ArbeidsgiverReferanse } from '@state/inntektsforhold/inntektsforhold';
import { toKronerOgØre } from '@utils/locale';

interface ArbeidsgiverRadProps {
    arbeidsgiverReferanse: ArbeidsgiverReferanse;
    årsinntekt: number;
    type: Skjønnsfastsettingstype | null;
    årligField: UseFormRegisterReturn;
    orgnummerField: UseFormRegisterReturn;
    antallArbeidsgivere: number;
    setÅrligFieldValue: (value: number) => void;
    clearArbeidsgiverErrors: () => void;
}

export const ArbeidsgiverRad = ({
    arbeidsgiverReferanse,
    årsinntekt,
    type,
    årligField,
    orgnummerField,
    antallArbeidsgivere,
    setÅrligFieldValue,
    clearArbeidsgiverErrors,
}: ArbeidsgiverRadProps) => {
    const [visningsverdi, setVisningsverdi] = useState(årsinntekt.toString());
    return (
        <Table.Row className={styles.arbeidsgiver}>
            <Table.DataCell>
                <HStack gap="3" align="center" maxWidth="228px">
                    <Arbeidsgiverikon />
                    <Inntektsforholdnavn inntektsforholdReferanse={arbeidsgiverReferanse} />
                </HStack>
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
