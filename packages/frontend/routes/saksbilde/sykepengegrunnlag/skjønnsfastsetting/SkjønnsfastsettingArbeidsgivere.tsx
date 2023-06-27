import { ArbeidsgiverForm } from './skjønnsfastsetting';
import classNames from 'classnames';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Arbeidsgiver, Arbeidsgiverinntekt } from '@io/graphql';

import { Arbeidsgivernavn } from '../Arbeidsgivernavn';

import styles from './SkjønnsfastsettingForm.module.css';

interface SkjønnsfastsettingArbeidsgivereProps {
    inntekter: Arbeidsgiverinntekt[];
    arbeidsgivere: Arbeidsgiver[];
}

export const SkjønnsfastsettingArbeidsgivere = ({ inntekter, arbeidsgivere }: SkjønnsfastsettingArbeidsgivereProps) => {
    const { control, formState, setValue } = useFormContext<{ arbeidsgivere: ArbeidsgiverForm[] }>();
    const isNumeric = (input: string) => /^\d+(\.\d{1,2})?$/.test(input);

    const getArbeidsgiverNavn = (organisasjonsnummer: string) =>
        arbeidsgivere.find((ag) => ag.organisasjonsnummer === organisasjonsnummer)?.navn;

    return (
        <div className={styles.arbeidsgivere}>
            {inntekter.map((inntekt, index) => {
                return (
                    <div key={`arbeidsgivere.[a${inntekt.arbeidsgiver}]`} className={styles.arbeidsgiver}>
                        <label className={styles.label}>
                            <Arbeidsgivernavn arbeidsgivernavn={getArbeidsgiverNavn(inntekt.arbeidsgiver)} />
                            <Controller
                                control={control}
                                name={`arbeidsgivere.${index}`}
                                rules={{
                                    required: true,
                                    validate: {
                                        måVæreNumerisk: (value: { organisasjonsnummer: string; årlig: number }) =>
                                            isNumeric(value.årlig.toString()) || 'Årsinntekt må være et beløp',
                                    },
                                }}
                                defaultValue={{
                                    organisasjonsnummer: inntekt.arbeidsgiver,
                                    årlig: inntekt.omregnetArsinntekt?.belop ?? 0,
                                }}
                                render={() => (
                                    <input
                                        className={classNames([styles.arbeidsgiverInput], {
                                            [styles.inputError]: !!formState.errors?.arbeidsgivere?.[index]?.message,
                                        })}
                                        defaultValue={inntekt.omregnetArsinntekt?.belop}
                                        onChange={(e) => {
                                            setValue(`arbeidsgivere.${index}`, {
                                                organisasjonsnummer: inntekt.arbeidsgiver,
                                                årlig: Number.parseFloat(e.target.value),
                                            });
                                        }}
                                        type="number"
                                        disabled
                                    />
                                )}
                            />
                        </label>
                    </div>
                );
            })}
        </div>
    );
};
