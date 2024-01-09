import React, { useEffect, useState } from 'react';
import { UseFormRegisterReturn, useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { Fieldset, Label, TextField } from '@navikt/ds-react';

import { Arbeidsgiver, Arbeidsgiverinntekt } from '@io/graphql';
import { somPenger } from '@utils/locale';

import { Arbeidsgivernavn } from '../../../Arbeidsgivernavn';
import { ArbeidsgiverForm } from '../../skjønnsfastsetting';

import styles from '../SkjønnsfastsettingForm/SkjønnsfastsettingForm.module.css';

interface SkjønnsfastsettingArbeidsgivereProps {
    arbeidsgivere: Arbeidsgiver[];
    inntekter: Arbeidsgiverinntekt[];
    sammenligningsgrunnlag: number;
}

export const SkjønnsfastsettingArbeidsgivere = ({
    arbeidsgivere,
    sammenligningsgrunnlag,
    inntekter,
}: SkjønnsfastsettingArbeidsgivereProps) => {
    const [tilFordeling, setTilFordeling] = useState(sammenligningsgrunnlag);
    const [inntektSum, setInntektSum] = useState(0);

    const { control, register, formState, clearErrors } = useFormContext<{
        arbeidsgivere: ArbeidsgiverForm[];
    }>();

    const begrunnelseId = useWatch({ name: 'begrunnelseId', defaultValue: '0' });

    const { fields } = useFieldArray({
        control,
        name: 'arbeidsgivere',
        rules: {
            validate: {
                måVæreNumerisk: (values) =>
                    values.some((value) => isNumeric(value.årlig.toString())) || 'Årsinntekt må være et beløp',
                sammenligningsgrunnlagMåVæreFordelt: (values) =>
                    begrunnelseId !== '1' ||
                    sammenligningsgrunnlag - values.reduce((sum, { årlig }) => sum + årlig, 0) === 0 ||
                    'Du må fordele hele sammenligningsgrunnlaget',
            },
        },
    });

    const getArbeidsgiverNavn = (organisasjonsnummer: string) =>
        arbeidsgivere.find((ag) => ag.organisasjonsnummer === organisasjonsnummer)?.navn;

    const arbeidsgivereField = useWatch({ name: 'arbeidsgivere', control });

    useEffect(() => {
        setInntektSum(arbeidsgivereField.reduce((sum, { årlig }) => sum + årlig, 0));
    }, [arbeidsgivereField]);
    useEffect(() => {
        if (begrunnelseId === '1') {
            setTilFordeling(sammenligningsgrunnlag - (isNaN(inntektSum) ? 0 : inntektSum));
        }
    }, [begrunnelseId, inntektSum]);

    return (
        <Fieldset
            legend="Skjønnsfastsett arbeidsgivere"
            hideLegend
            error={formState.errors.arbeidsgivere?.root?.message}
            className={styles.arbeidsgivere}
        >
            <table className={styles.tabell}>
                {begrunnelseId === '1' && (
                    <tr>
                        <th />
                        <th>
                            <Label>Rapportert</Label>
                        </th>
                        <th>
                            <Label>Fordeling</Label>
                        </th>
                    </tr>
                )}
                {begrunnelseId === '2' && (
                    <tr>
                        <th />
                        <th>
                            <Label>Årsinntekt</Label>
                        </th>
                    </tr>
                )}
                {fields.map((field, index) => {
                    const årligField = register(`arbeidsgivere.${index}.årlig`, {
                        valueAsNumber: true,
                    });

                    const orgnummerField = register(`arbeidsgivere.${index}.organisasjonsnummer`, {
                        value: field.organisasjonsnummer,
                    });

                    const arbeidsgiversammenligningsgrunnlag =
                        inntekter.find((inntekt) => inntekt.arbeidsgiver === field.organisasjonsnummer)
                            ?.sammenligningsgrunnlag?.belop ?? 0;

                    const avrundetArbeidsgiversammenligningsgrunnlag =
                        Math.round((arbeidsgiversammenligningsgrunnlag + Number.EPSILON) * 100) / 100;

                    return (
                        <ArbeidsgiverRad
                            key={field.id}
                            arbeidsgiverNavn={getArbeidsgiverNavn(field.organisasjonsnummer)}
                            begrunnelseId={begrunnelseId}
                            arbeidsgiversammenligningsgrunnlag={avrundetArbeidsgiversammenligningsgrunnlag}
                            årligField={årligField}
                            orgnummerField={orgnummerField}
                            clearArbeidsgiverErrors={() => clearErrors('arbeidsgivere')}
                        />
                    );
                })}
                <tfoot className={styles.total}>
                    {begrunnelseId === '1' && (
                        <tr>
                            <td>Til fordeling</td>
                            {begrunnelseId === '1' && <td></td>}
                            <td className={styles.inntektSum}>{somPenger(tilFordeling)}</td>
                        </tr>
                    )}
                    <tr>
                        <td>
                            <Label>Sykepengegrunnlag</Label>
                        </td>
                        {begrunnelseId === '1' && <td></td>}
                        <td className={styles.inntektSum}>
                            <Label>{somPenger(isNaN(inntektSum) ? 0 : inntektSum)}</Label>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </Fieldset>
    );
};

interface ArbeidsgiverRadProps {
    arbeidsgiverNavn?: string;
    begrunnelseId: string;
    arbeidsgiversammenligningsgrunnlag?: number;
    årligField: UseFormRegisterReturn;
    orgnummerField: UseFormRegisterReturn;
    clearArbeidsgiverErrors: () => void;
}

const ArbeidsgiverRad = ({
    arbeidsgiverNavn,
    begrunnelseId,
    arbeidsgiversammenligningsgrunnlag,
    årligField,
    orgnummerField,
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
                disabled={begrunnelseId === '0'}
                className={styles.arbeidsgiverInput}
            />
            <input {...orgnummerField} hidden style={{ display: 'none' }} />
        </td>
    </tr>
);

const isNumeric = (input: string) => /^\d+(\.\d{1,2})?$/.test(input);
