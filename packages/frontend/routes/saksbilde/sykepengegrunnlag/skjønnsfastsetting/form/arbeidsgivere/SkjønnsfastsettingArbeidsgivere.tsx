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
    const { watch } = useFormContext();

    const aktiveArbeidsgivere = arbeidsgivere.filter(
        (arbeidsgiver) =>
            inntekter.find((inntekt) => inntekt.arbeidsgiver === arbeidsgiver.organisasjonsnummer)
                ?.omregnetArsinntekt !== null,
    );
    const getArbeidsgiverNavn = (organisasjonsnummer: string) =>
        aktiveArbeidsgivere.find((ag) => ag.organisasjonsnummer === organisasjonsnummer)?.navn;

    const begrunnelseId = watch('begrunnelseId', '0');

    return (
        <Fieldset
            className={styles.arbeidsgivere}
            id="arbeidsgivere"
            legend="Skjønnsfastsett arbeidsgiver(e)"
            hideLegend
        >
            {inntekter
                .filter((inntekt) =>
                    aktiveArbeidsgivere.some(
                        (arbeidsgiver) =>
                            arbeidsgiver.organisasjonsnummer === inntekt.arbeidsgiver &&
                            inntekt.omregnetArsinntekt !== null,
                    ),
                )
                .map((inntekt, index) => (
                    <div key={`arbeidsgivere.[a${inntekt.arbeidsgiver}]`} className={styles.arbeidsgiver}>
                        <label className={styles.label}>
                            {aktiveArbeidsgivere.length === 1 && (
                                <div className={styles.enArbeidsgiver}>Sykepengegrunnlag i kroner</div>
                            )}
                            {aktiveArbeidsgivere.length > 1 && inntekt.arbeidsgiver && (
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
