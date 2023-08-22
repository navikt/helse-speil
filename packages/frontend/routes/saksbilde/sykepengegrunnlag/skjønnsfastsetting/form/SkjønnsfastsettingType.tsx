import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Radio, RadioGroup } from '@navikt/ds-react';

import { skjønnsfastsettelseBegrunnelser } from '../skjønnsfastsetting';

import styles from './SkjønnsfastsettingForm.module.css';

export const SkjønnsfastsettingType = () => {
    const { register } = useFormContext();
    const { ref, ...typeValidation } = register('begrunnelseId', { required: 'Du må velge en type' });

    return (
        <div className={styles.skjønnsfastsettingBegrunnelse}>
            <RadioGroup className={styles.begrunnelser} name="begrunnelseId" legend="Velg type skjønnsfastsettelse">
                {skjønnsfastsettelseBegrunnelser().map((begrunnelse, index) => (
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
