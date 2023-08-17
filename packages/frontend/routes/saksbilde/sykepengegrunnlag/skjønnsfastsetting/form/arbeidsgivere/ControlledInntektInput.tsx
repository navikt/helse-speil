import React, { useEffect } from 'react';
import { Control, UseFormSetValue, useController } from 'react-hook-form';

import { TextField } from '@navikt/ds-react';

import { Arbeidsgiverinntekt } from '@io/graphql';

import { ArbeidsgiverForm } from '../../skjønnsfastsetting';
import styles from '../SkjønnsfastsettingForm.module.css';

interface ControlledInntektInputProps {
    control: Control<{ arbeidsgivere: ArbeidsgiverForm[] }>;
    index: number;
    inntekt: Arbeidsgiverinntekt;
    setValue: UseFormSetValue<{ arbeidsgivere: ArbeidsgiverForm[] }>;
    begrunnelseId: string;
}

export const ControlledInntektInput = ({
    control,
    index,
    inntekt,
    setValue,
    begrunnelseId,
}: ControlledInntektInputProps) => {
    const { field, fieldState } = useController({
        control: control,
        name: `arbeidsgivere.${index}`,
        rules: {
            required: true,
            validate: {
                måVæreNumerisk: (value: { organisasjonsnummer: string; årlig: number }) =>
                    isNumeric(value.årlig.toString()) || 'Årsinntekt må være et beløp',
            },
        },
        defaultValue: {
            organisasjonsnummer: inntekt.arbeidsgiver,
            årlig: inntekt.omregnetArsinntekt?.belop ?? 0,
        },
    });
    const isNumeric = (input: string) => /^\d+(\.\d{1,2})?$/.test(input);
    useEffect(() => {
        if (begrunnelseId === '0') {
            setValue(`arbeidsgivere.${index}`, {
                organisasjonsnummer: inntekt.arbeidsgiver,
                årlig: inntekt.omregnetArsinntekt?.belop ?? 0,
            });
        } else if (begrunnelseId === '1') {
            setValue(`arbeidsgivere.${index}`, {
                organisasjonsnummer: inntekt.arbeidsgiver,
                årlig: inntekt.sammenligningsgrunnlag?.belop ?? 0,
            });
        }
    }, [begrunnelseId]);

    return (
        <TextField
            {...field}
            {...fieldState}
            className={styles.arbeidsgiverInput}
            value={field.value.årlig}
            error={fieldState.error?.message}
            onChange={(e) => {
                setValue(`arbeidsgivere.${index}`, {
                    organisasjonsnummer: inntekt.arbeidsgiver,
                    årlig: Number.parseFloat(e.target.value),
                });
            }}
            label="Skjønnsfastsatt arbeidsgiverinntekt"
            size="small"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            hideLabel
            disabled={begrunnelseId !== '2'}
        />
    );
};
