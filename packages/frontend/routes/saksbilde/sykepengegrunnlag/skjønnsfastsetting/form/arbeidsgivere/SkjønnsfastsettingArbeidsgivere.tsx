import React, { useEffect, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { Detail, Fieldset, Label } from '@navikt/ds-react';

import { LovdataLenke } from '@components/LovdataLenke';
import { Arbeidsgiver, Arbeidsgiverinntekt, Sykepengegrunnlagsgrense } from '@io/graphql';
import { somPenger, somPengerUtenDesimaler } from '@utils/locale';

import { ArbeidsgiverForm } from '../../skjønnsfastsetting';
import { ArbeidsgiverRad } from './ArbeidsgiverRad';

import styles from '../SkjønnsfastsettingForm/SkjønnsfastsettingForm.module.css';

interface SkjønnsfastsettingArbeidsgivereProps {
    arbeidsgivere: Arbeidsgiver[];
    inntekter: Arbeidsgiverinntekt[];
    sammenligningsgrunnlag: number;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
}

export const SkjønnsfastsettingArbeidsgivere = ({
    arbeidsgivere,
    sammenligningsgrunnlag,
    inntekter,
    sykepengegrunnlagsgrense,
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

    const antallArbeidsgivere = fields.length;

    useEffect(() => {
        setInntektSum(arbeidsgivereField.reduce((sum, { årlig }) => sum + årlig, 0));
    }, [arbeidsgivereField]);
    useEffect(() => {
        if (begrunnelseId === '1') {
            setTilFordeling(sammenligningsgrunnlag - (isNaN(inntektSum) ? 0 : inntektSum));
        }
    }, [begrunnelseId, inntektSum]);

    const erBegrensetTil6G = inntektSum > sykepengegrunnlagsgrense.grense;

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
                            antallArbeidsgivere={antallArbeidsgivere}
                            clearArbeidsgiverErrors={() => clearErrors('arbeidsgivere')}
                        />
                    );
                })}
                <tfoot className={styles.total}>
                    {begrunnelseId === '1' && antallArbeidsgivere > 1 && (
                        <tr>
                            <td>Til fordeling</td>
                            {begrunnelseId === '1' && <td></td>}
                            <td className={styles.inntektSum}>{somPenger(tilFordeling)}</td>
                        </tr>
                    )}
                    <tr>
                        <td>Skjønnsfastsatt årsinntekt</td>
                        {begrunnelseId === '1' && <td></td>}
                        <td className={styles.inntektSum}>
                            <Label>{somPenger(isNaN(inntektSum) ? 0 : inntektSum)}</Label>
                        </td>
                    </tr>
                    <tr className={styles.sykepengegrunnlag}>
                        <td>
                            <Label className={styles.Bold}>Sykepengegrunnlag</Label>
                        </td>
                        {begrunnelseId === '1' && <td></td>}
                        <td className={styles.inntektSum}>
                            <Label className={styles.Bold}>
                                {somPenger(
                                    isNaN(inntektSum)
                                        ? 0
                                        : erBegrensetTil6G
                                          ? sykepengegrunnlagsgrense.grense
                                          : inntektSum,
                                )}
                            </Label>
                        </td>
                    </tr>
                    {erBegrensetTil6G && (
                        <tr className={styles.erBegrenset}>
                            <td>
                                <Detail className={styles.detail}>
                                    <span>
                                        {`Sykepengegrunnlaget er begrenset til 6G: ${somPengerUtenDesimaler(
                                            sykepengegrunnlagsgrense.grense,
                                        )}`}
                                    </span>
                                    <LovdataLenke paragraf="8-10">§ 8-10</LovdataLenke>
                                </Detail>
                            </td>
                        </tr>
                    )}
                </tfoot>
            </table>
        </Fieldset>
    );
};

const isNumeric = (input: string) => /^\d+(\.\d{1,2})?$/.test(input);
