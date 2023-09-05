import React, { useEffect, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

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

    const { watch } = useFormContext();
    const begrunnelseId = watch('begrunnelseId', '0');

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

    const isNumeric = (input: string) => /^\d+(\.\d{1,2})?$/.test(input);

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
            {begrunnelseId === '1' && (
                <Label className={styles.tilFordeling}>
                    {somPenger(tilFordeling)} må fordeles{' '}
                    {arbeidsgivere.length > 1 ? 'mellom arbeidgiverne' : 'til arbeidsgiver'}
                </Label>
            )}
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
                {fields.map((field, index) => {
                    const årligField = register(`arbeidsgivere.${index}.årlig`, {
                        valueAsNumber: true,
                    });

                    return (
                        <tr key={field.id} className={styles.arbeidsgiver}>
                            <td>
                                <Arbeidsgivernavn
                                    arbeidsgivernavn={getArbeidsgiverNavn(field.organisasjonsnummer)}
                                    className={styles.arbeidsgivernavn}
                                />
                            </td>
                            {begrunnelseId === '1' && (
                                <td>
                                    <TextField
                                        label="Rapportert årsinntekt"
                                        hideLabel
                                        size="small"
                                        disabled
                                        value={
                                            inntekter.find(
                                                (inntekt) => inntekt.arbeidsgiver === field.organisasjonsnummer,
                                            )?.sammenligningsgrunnlag?.belop
                                        }
                                        className={styles.arbeidsgiverInput}
                                    />
                                </td>
                            )}
                            <td>
                                <TextField
                                    {...årligField}
                                    onChange={(e) => {
                                        clearErrors('arbeidsgivere');
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
                                <input
                                    {...register(`arbeidsgivere.${index}.organisasjonsnummer`, {
                                        value: field.organisasjonsnummer,
                                    })}
                                    hidden
                                    style={{ display: 'none' }}
                                />
                            </td>
                        </tr>
                    );
                })}
                <tfoot className={styles.total}>
                    <tr>
                        <td>Totalt</td>
                        {begrunnelseId === '1' && <td></td>}
                        <td className={styles.inntektSum}>{somPenger(isNaN(inntektSum) ? 0 : inntektSum)}</td>
                    </tr>
                </tfoot>
            </table>
        </Fieldset>
    );
};
