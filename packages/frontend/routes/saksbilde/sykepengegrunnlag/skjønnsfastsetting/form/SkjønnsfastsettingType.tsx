import styles from './SkjønnsfastsettingBegrunnelse.module.scss';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Radio, RadioGroup } from '@navikt/ds-react';

import { skjønnsfastsettelseBegrunnelser } from '../skjønnsfastsetting';

export const SkjønnsfastsettingType = () => {
    const { register } = useFormContext();
    const { ref, ...typeValidation } = register('type', {
        required: 'Du må velge en type',
    });

    return (
        <div className={styles.skjønnsfastsettingBegrunnelse}>
            <RadioGroup className={styles.begrunnelser} name="type" legend="Velg type skjønnsfastsettelse">
                {skjønnsfastsettelseBegrunnelser().map((begrunnelse, index) => (
                    <div key={index}>
                        <Radio value={begrunnelse.type} ref={ref} {...typeValidation}>
                            {begrunnelse.valg}
                        </Radio>
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
};
