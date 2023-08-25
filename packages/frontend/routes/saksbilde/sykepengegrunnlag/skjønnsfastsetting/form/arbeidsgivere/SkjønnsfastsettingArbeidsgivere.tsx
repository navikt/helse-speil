import classNames from 'classnames';
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Fieldset, TextField } from '@navikt/ds-react';

import { Arbeidsgiver } from '@io/graphql';

import { Arbeidsgivernavn } from '../../../Arbeidsgivernavn';
import { ArbeidsgiverForm } from '../../skjønnsfastsetting';
import styles from '../SkjønnsfastsettingForm.module.css';

interface SkjønnsfastsettingArbeidsgivereProps {
    arbeidsgivere: Arbeidsgiver[];
}

export const SkjønnsfastsettingArbeidsgivere = ({ arbeidsgivere }: SkjønnsfastsettingArbeidsgivereProps) => {
    const { control, register, formState, clearErrors } = useFormContext<{
        arbeidsgivere: ArbeidsgiverForm[];
    }>();

    const { fields } = useFieldArray({
        control,
        name: 'arbeidsgivere',
        rules: {
            validate: {
                måVæreNumerisk: (values) =>
                    values.some((value) => isNumeric(value.årlig.toString())) || 'Årsinntekt må være et beløp',
            },
        },
    });

    const isNumeric = (input: string) => /^\d+(\.\d{1,2})?$/.test(input);
    const { watch } = useFormContext();

    const getArbeidsgiverNavn = (organisasjonsnummer: string) =>
        arbeidsgivere.find((ag) => ag.organisasjonsnummer === organisasjonsnummer)?.navn;

    const begrunnelseId = watch('begrunnelseId', '0');

    return (
        <Fieldset
            className={styles.arbeidsgivere}
            id="arbeidsgivere"
            legend="Skjønnsfastsett arbeidsgiver(e)"
            hideLegend
        >
            {fields.map((field, index) => {
                const årligField = register(`arbeidsgivere.${index}.årlig`, {
                    valueAsNumber: true,
                });

                return (
                    <div key={field.id}>
                        <label className={classNames([styles.arbeidsgiver, styles.label])}>
                            {arbeidsgivere.length === 1 && (
                                <div className={styles.enArbeidsgiver}>Sykepengegrunnlag i kroner</div>
                            )}
                            {arbeidsgivere.length > 1 && field.organisasjonsnummer && (
                                <Arbeidsgivernavn arbeidsgivernavn={getArbeidsgiverNavn(field.organisasjonsnummer)} />
                            )}
                            <TextField
                                {...årligField}
                                onChange={(e) => {
                                    clearErrors('arbeidsgivere');
                                    return årligField.onChange(e);
                                }}
                                error={formState.errors.arbeidsgivere?.root?.message}
                                className={styles.arbeidsgiverInput}
                                size="small"
                                label="Skjønnsfastsatt årlig inntekt"
                                hideLabel
                                type="text"
                                inputMode="numeric"
                                disabled={begrunnelseId !== '2'}
                            />
                            <input
                                {...register(`arbeidsgivere.${index}.organisasjonsnummer`, {
                                    value: field.organisasjonsnummer,
                                })}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                );
            })}
        </Fieldset>
    );
};
