import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Radio, RadioGroup } from '@navikt/ds-react';

import { tilgjengeligeBegrunnelser } from '@utils/featureToggles';

import { skjønnsfastsettelseBegrunnelser } from '../skjønnsfastsetting';

import styles from './SkjønnsfastsettingForm.module.css';

interface SkjønnsfastsettingTypeProps {
    forrigeBegrunnelseId?: string;
}

export const SkjønnsfastsettingType = ({ forrigeBegrunnelseId }: SkjønnsfastsettingTypeProps) => {
    const { register } = useFormContext();
    const { ref, ...typeValidation } = register('begrunnelseId', {
        required: 'Du må velge en type',
        value: forrigeBegrunnelseId,
    });

    return (
        <div className={styles.skjønnsfastsettingBegrunnelse}>
            <RadioGroup className={styles.begrunnelser} name="begrunnelseId" legend="Velg type skjønnsfastsettelse">
                {skjønnsfastsettelseBegrunnelser()
                    .filter((begrunnelse) => tilgjengeligeBegrunnelser.includes(begrunnelse.id))
                    .map((begrunnelse, index) => (
                        <div key={index}>
                            <Radio value={begrunnelse.id} ref={ref} {...typeValidation}>
                                {begrunnelse.valg}
                            </Radio>
                        </div>
                    ))}
            </RadioGroup>
        </div>
    );
};
