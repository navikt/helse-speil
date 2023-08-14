import { ArbeidsgiverForm } from './skjønnsfastsetting';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Arbeidsgiver, Arbeidsgiverinntekt } from '@io/graphql';

import { Arbeidsgivernavn } from '../Arbeidsgivernavn';
import { ControlledInntektInput } from './ControlledInntektInput';

import styles from './SkjønnsfastsettingForm.module.css';

interface SkjønnsfastsettingArbeidsgivereProps {
    inntekter: Arbeidsgiverinntekt[];
    arbeidsgivere: Arbeidsgiver[];
}

export const SkjønnsfastsettingArbeidsgivere = ({ inntekter, arbeidsgivere }: SkjønnsfastsettingArbeidsgivereProps) => {
    const { control, setValue } = useFormContext<{ arbeidsgivere: ArbeidsgiverForm[] }>();
    const getArbeidsgiverNavn = (organisasjonsnummer: string) =>
        arbeidsgivere.find((ag) => ag.organisasjonsnummer === organisasjonsnummer)?.navn;

    return (
        <div className={styles.arbeidsgivere}>
            {inntekter.map((inntekt, index) => {
                return (
                    <div key={`arbeidsgivere.[a${inntekt.arbeidsgiver}]`} className={styles.arbeidsgiver}>
                        <label className={styles.label}>
                            <Arbeidsgivernavn arbeidsgivernavn={getArbeidsgiverNavn(inntekt.arbeidsgiver)} />
                            <ControlledInntektInput
                                control={control}
                                index={index}
                                inntekt={inntekt}
                                setValue={setValue}
                            />
                        </label>
                    </div>
                );
            })}
        </div>
    );
};
