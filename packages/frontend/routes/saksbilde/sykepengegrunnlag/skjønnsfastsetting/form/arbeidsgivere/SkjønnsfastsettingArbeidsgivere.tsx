import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Fieldset } from '@navikt/ds-react';

import { Arbeidsgiver, Arbeidsgiverinntekt } from '@io/graphql';

import { Arbeidsgivernavn } from '../../../Arbeidsgivernavn';
import { ArbeidsgiverForm } from '../../skjønnsfastsetting';
import styles from '../SkjønnsfastsettingForm.module.css';
import { ControlledInntektInput } from './ControlledInntektInput';

interface SkjønnsfastsettingArbeidsgivereProps {
    inntekter: Arbeidsgiverinntekt[];
    arbeidsgivere: Arbeidsgiver[];
}

export const SkjønnsfastsettingArbeidsgivere = ({ inntekter, arbeidsgivere }: SkjønnsfastsettingArbeidsgivereProps) => {
    const { control, setValue } = useFormContext<{ arbeidsgivere: ArbeidsgiverForm[] }>();
    const { watch, formState } = useFormContext();
    const getArbeidsgiverNavn = (organisasjonsnummer: string) =>
        arbeidsgivere.find((ag) => ag.organisasjonsnummer === organisasjonsnummer)?.navn;
    const begrunnelseId = watch('begrunnelseId', '0');

    return (
        <Fieldset
            className={styles.arbeidsgivere}
            id="arbeidsgivere"
            legend="Skjønnsfastsett arbeidsgiver(e)"
            error={
                !formState.isValid &&
                formState.isSubmitted &&
                (formState.errors.måEndreHvisSkjønsfastsattFinnes?.message as string)
            }
            hideLegend
        >
            {inntekter.map((inntekt, index) => (
                <div key={`arbeidsgivere.[a${inntekt.arbeidsgiver}]`} className={styles.arbeidsgiver}>
                    <label className={styles.label}>
                        {arbeidsgivere.length === 1 && (
                            <div className={styles.enArbeidsgiver}>Sykepengegrunnlag i kroner</div>
                        )}
                        {arbeidsgivere.length > 1 && inntekt.arbeidsgiver && (
                            <Arbeidsgivernavn arbeidsgivernavn={getArbeidsgiverNavn(inntekt.arbeidsgiver)} />
                        )}
                        <ControlledInntektInput
                            control={control}
                            index={index}
                            inntekt={inntekt}
                            setValue={setValue}
                            begrunnelseId={begrunnelseId}
                        />
                    </label>
                </div>
            ))}
        </Fieldset>
    );
};
