import React from 'react';
import { useFormContext } from 'react-hook-form';

import { BodyLong, BodyShort, Textarea } from '@navikt/ds-react';

import { skjønnsfastsettelseBegrunnelser } from '../skjønnsfastsetting';

import styles from './SkjønnsfastsettingForm.module.css';

interface SkjønnsfastsettingBegrunnelseProps {
    omregnetÅrsinntekt: number;
    sammenligningsgrunnlag: number;
    forrigeSkjønnsfastsettelseFritekst: string;
}

export const SkjønnsfastsettingBegrunnelse = ({
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    forrigeSkjønnsfastsettelseFritekst,
}: SkjønnsfastsettingBegrunnelseProps) => {
    const { formState, register, watch } = useFormContext();
    const begrunnelseId = watch('begrunnelseId');
    const arbeidsgivere = watch('arbeidsgivere', []);
    const annet = arbeidsgivere.reduce((n: number, { årlig }: { årlig: number }) => n + årlig, 0);

    const valgtBegrunnelse = skjønnsfastsettelseBegrunnelser(omregnetÅrsinntekt, sammenligningsgrunnlag, annet).find(
        (begrunnelse) => begrunnelse.id === begrunnelseId,
    );

    return (
        <div className={styles.skjønnsfastsettingBegrunnelse}>
            <div>
                <BodyShort>
                    <span className={styles.Bold}>Begrunnelse</span> (teksten vises til bruker)
                </BodyShort>
                {valgtBegrunnelse?.mal && <BodyLong className={styles.mal}>{valgtBegrunnelse.mal}</BodyLong>}
            </div>
            <Textarea
                className={styles.fritekst}
                label="Nærmere begrunnelse for skjønnsvurderingen"
                {...register('begrunnelseFritekst', {
                    required: 'Du må skrive en nærmere begrunnelse',
                    value: forrigeSkjønnsfastsettelseFritekst,
                })}
                description="(Teksten vises til bruker)"
                error={
                    formState.errors.begrunnelseFritekst
                        ? (formState.errors.begrunnelseFritekst.message as string)
                        : null
                }
            />
            {valgtBegrunnelse?.konklusjon && <BodyLong className={styles.mal}>{valgtBegrunnelse.konklusjon}</BodyLong>}
        </div>
    );
};
