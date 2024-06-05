import React, { useEffect, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { Detail, Fieldset, Label } from '@navikt/ds-react';

import { LovdataLenke } from '@components/LovdataLenke';
import { Arbeidsgiver, Sykepengegrunnlagsgrense } from '@io/graphql';
import { somPenger, somPengerUtenDesimaler } from '@utils/locale';

import { ArbeidsgiverForm, Skjønnsfastsettingstype } from '../../skjønnsfastsetting';
import { ArbeidsgiverRad } from './ArbeidsgiverRad';

import styles from '../SkjønnsfastsettingForm/SkjønnsfastsettingForm.module.css';

interface SkjønnsfastsettingArbeidsgivereProps {
    arbeidsgivere: Arbeidsgiver[];
    sammenligningsgrunnlag: number;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
}

export const SkjønnsfastsettingArbeidsgivere = ({
    arbeidsgivere,
    sammenligningsgrunnlag,
    sykepengegrunnlagsgrense,
}: SkjønnsfastsettingArbeidsgivereProps) => {
    const [tilFordeling, setTilFordeling] = useState(sammenligningsgrunnlag);
    const [inntektSum, setInntektSum] = useState(0);

    const { control, register, formState, clearErrors } = useFormContext<{
        arbeidsgivere: ArbeidsgiverForm[];
    }>();

    const type = useWatch({ name: 'type', defaultValue: '0' });

    const { fields } = useFieldArray({
        control,
        name: 'arbeidsgivere',
        rules: {
            validate: {
                måVæreNumerisk: (values) =>
                    values.some((value) => isNumeric(value.årlig.toString())) ||
                    'Årsinntekt må være et beløp med maks to desimaler',
                sammenligningsgrunnlagMåVæreFordelt: (values) =>
                    type !== Skjønnsfastsettingstype.RAPPORTERT_ÅRSINNTEKT ||
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
        if (type === Skjønnsfastsettingstype.RAPPORTERT_ÅRSINNTEKT) {
            setTilFordeling(sammenligningsgrunnlag - (isNaN(inntektSum) ? 0 : inntektSum));
        }
    }, [type, inntektSum]);

    const erBegrensetTil6G = inntektSum > sykepengegrunnlagsgrense.grense;

    return (
        <Fieldset
            legend="Skjønnsfastsett arbeidsgivere"
            hideLegend
            error={formState.errors.arbeidsgivere?.root?.message}
            className={styles.arbeidsgivere}
        >
            <table className={styles.tabell}>
                <thead>
                    <tr>
                        <th />
                        <th>
                            <Label>Årsinntekt</Label>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {fields.map((field, index) => {
                        const årligField = register(`arbeidsgivere.${index}.årlig`, {
                            setValueAs: (value) => Number(value.toString().replaceAll(/\s/g, '').replaceAll(',', '.')),
                        });

                        const orgnummerField = register(`arbeidsgivere.${index}.organisasjonsnummer`, {
                            value: field.organisasjonsnummer,
                        });

                        return (
                            <ArbeidsgiverRad
                                key={field.id}
                                arbeidsgiverNavn={getArbeidsgiverNavn(field.organisasjonsnummer)}
                                type={type}
                                årligField={årligField}
                                orgnummerField={orgnummerField}
                                antallArbeidsgivere={antallArbeidsgivere}
                                clearArbeidsgiverErrors={() => clearErrors('arbeidsgivere')}
                            />
                        );
                    })}
                </tbody>
                <tfoot className={styles.total}>
                    {type === Skjønnsfastsettingstype.RAPPORTERT_ÅRSINNTEKT && antallArbeidsgivere > 1 && (
                        <tr>
                            <td>Til fordeling</td>
                            <td className={styles.inntektSum}>{somPenger(tilFordeling)}</td>
                        </tr>
                    )}
                    <tr>
                        <td>Skjønnsfastsatt årsinntekt</td>
                        <td className={styles.inntektSum}>
                            <Label>{somPenger(isNaN(inntektSum) ? 0 : inntektSum)}</Label>
                        </td>
                    </tr>
                    <tr className={styles.sykepengegrunnlag}>
                        <td>
                            <Label className={styles.Bold}>Sykepengegrunnlag</Label>
                        </td>
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
