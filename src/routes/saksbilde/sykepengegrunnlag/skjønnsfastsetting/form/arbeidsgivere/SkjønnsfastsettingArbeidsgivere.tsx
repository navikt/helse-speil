import React from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { Detail, Fieldset, Label, Table } from '@navikt/ds-react';

import { LovdataLenke } from '@components/LovdataLenke';
import { ArbeidsgiverFragment, Sykepengegrunnlagsgrense } from '@io/graphql';
import { SkjønnsfastsettingFormFields } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/form/skjønnsfastsettingForm/SkjønnsfastsettingForm';
import styles from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/form/skjønnsfastsettingForm/SkjønnsfastsettingForm.module.css';
import { Skjønnsfastsettingstype } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/skjønnsfastsetting';
import { somPenger, somPengerUtenDesimaler } from '@utils/locale';
import { avrundetToDesimaler, isNumeric } from '@utils/tall';

import { ArbeidsgiverRad } from './ArbeidsgiverRad';

interface SkjønnsfastsettingArbeidsgivereProps {
    arbeidsgivere: ArbeidsgiverFragment[];
    sammenligningsgrunnlag: number;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
}

export const SkjønnsfastsettingArbeidsgivere = ({
    arbeidsgivere,
    sammenligningsgrunnlag,
    sykepengegrunnlagsgrense,
}: SkjønnsfastsettingArbeidsgivereProps) => {
    const { control, register, formState, clearErrors } = useFormContext<SkjønnsfastsettingFormFields>();

    const type = useWatch({ name: 'type', defaultValue: undefined, control });
    const arbeidsgivereField = useWatch({ name: 'arbeidsgivere', control });

    const inntektSum = arbeidsgivereField.reduce((sum, { årlig }) => sum + årlig, 0);
    const tilFordeling =
        type !== Skjønnsfastsettingstype.RAPPORTERT_ÅRSINNTEKT
            ? sammenligningsgrunnlag
            : sammenligningsgrunnlag - (isNaN(inntektSum) ? 0 : inntektSum);
    const erBegrensetTil6G = inntektSum > sykepengegrunnlagsgrense.grense;

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
                    avrundetToDesimaler(sammenligningsgrunnlag - values.reduce((sum, { årlig }) => sum + årlig, 0)) ===
                        0 ||
                    'Du må fordele hele sammenligningsgrunnlaget',
            },
        },
    });

    const antallArbeidsgivere = fields.length;

    const getArbeidsgiverNavn = (organisasjonsnummer: string) =>
        arbeidsgivere.find((ag) => ag.organisasjonsnummer === organisasjonsnummer)?.navn;

    return (
        <Fieldset
            legend="Skjønnsfastsett arbeidsgivere"
            hideLegend
            error={formState.errors.arbeidsgivere?.root?.message}
            className={styles.arbeidsgivere}
        >
            <Table className={styles.tabell}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell />
                        <Table.HeaderCell>
                            <Label>Årsinntekt</Label>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
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
                </Table.Body>
                <tfoot className={styles.total}>
                    {type === Skjønnsfastsettingstype.RAPPORTERT_ÅRSINNTEKT && antallArbeidsgivere > 1 && (
                        <Table.Row>
                            <Table.DataCell>Til fordeling</Table.DataCell>
                            <Table.DataCell className={styles.inntektSum}>{somPenger(tilFordeling)}</Table.DataCell>
                        </Table.Row>
                    )}
                    <Table.Row>
                        <Table.DataCell>Skjønnsfastsatt årsinntekt</Table.DataCell>
                        <Table.DataCell className={styles.inntektSum}>
                            <Label>{somPenger(isNaN(inntektSum) ? 0 : inntektSum)}</Label>
                        </Table.DataCell>
                    </Table.Row>
                    <Table.Row className={styles.sykepengegrunnlag}>
                        <Table.DataCell>
                            <Label className={styles.Bold}>Sykepengegrunnlag</Label>
                        </Table.DataCell>
                        <Table.DataCell className={styles.inntektSum}>
                            <Label className={styles.Bold}>
                                {somPenger(
                                    isNaN(inntektSum)
                                        ? 0
                                        : erBegrensetTil6G
                                          ? sykepengegrunnlagsgrense.grense
                                          : inntektSum,
                                )}
                            </Label>
                        </Table.DataCell>
                    </Table.Row>
                    {erBegrensetTil6G && (
                        <Table.Row className={styles.erBegrenset}>
                            <Table.DataCell>
                                <Detail className={styles.detail}>
                                    <span>
                                        {`Sykepengegrunnlaget er begrenset til 6G: ${somPengerUtenDesimaler(
                                            sykepengegrunnlagsgrense.grense,
                                        )}`}
                                    </span>
                                    <LovdataLenke paragraf="8-10">§ 8-10</LovdataLenke>
                                </Detail>
                            </Table.DataCell>
                        </Table.Row>
                    )}
                </tfoot>
            </Table>
        </Fieldset>
    );
};
