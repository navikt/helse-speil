import React from 'react';
import { useFormContext } from 'react-hook-form';

import { BodyLong, BodyShort, Radio, RadioGroup, Textarea } from '@navikt/ds-react';

import { Bold } from '@components/Bold';

import { skjønnsfastsettelseBegrunnelser } from '../skjønnsfastsetting';

import styles from './SkjønnsfastsettingForm.module.css';

interface SkjønnsfastsettingBegrunnelseProps {
    omregnetÅrsinntekt: number;
    sammenligningsgrunnlag: number;
}

export const SkjønnsfastsettingBegrunnelse = ({
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
}: SkjønnsfastsettingBegrunnelseProps) => {
    const { formState, register } = useFormContext();
    const { ref, ...begrunnelseValidation } = register('begrunnelseId', { required: 'Du må velge en mal' });

    return (
        <div className={styles.skjønnsfastsettingBegrunnelse}>
            <div>
                <Bold>Begrunnelse</Bold>
                <BodyShort>Begrunn hvorfor sykepengegrunnlaget er skjønnsfastsatt.</BodyShort>
            </div>
            <RadioGroup
                className={styles.begrunnelser}
                name="begrunnelseId"
                legend="Velg mal for begrunnelsen"
                defaultValue="0"
            >
                {skjønnsfastsettelseBegrunnelser(omregnetÅrsinntekt, sammenligningsgrunnlag).map(
                    (begrunnelse, index) => (
                        <div key={index}>
                            <Radio value={begrunnelse.id} ref={ref} {...begrunnelseValidation}>
                                {begrunnelse.valg}
                            </Radio>
                            <BodyLong className={styles.mal}>{begrunnelse.mal}</BodyLong>
                        </div>
                    ),
                )}
                <Textarea
                    className={styles.fritekst}
                    label="Nærmere begrunnelse for skjønnsvurderingen"
                    {...register('begrunnelseFritekst', {
                        required: 'Du må skrive en nærmere begrunnelse',
                    })}
                    description="(Teksten vises til bruker)"
                    error={
                        formState.errors.begrunnelseFritekst
                            ? (formState.errors.begrunnelseFritekst.message as string)
                            : null
                    }
                />
            </RadioGroup>
        </div>
    );
};
