import styles from './SkjønnsfastsettingBegrunnelse.module.scss';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useRecoilValue } from 'recoil';

import { Radio, RadioGroup } from '@navikt/ds-react';

import { skjønnsfastsettingMaler } from '../state';

export const SkjønnsfastsettingÅrsak = () => {
    const { formState, register, setValue } = useFormContext();
    const årsaker = useRecoilValue(skjønnsfastsettingMaler).flatMap((it) => it.arsak);
    const { ref, ...årsakValidation } = register('årsak', { required: 'Du må velge en årsak' });

    const resetType = () => {
        setValue('type', '');
    };

    return (
        <RadioGroup
            className={styles.årsak}
            name="årsak"
            error={formState.errors.årsak ? (formState.errors.årsak.message as string) : null}
            legend="Årsak til skjønnsfastsettelse"
            onChange={resetType}
        >
            {årsaker.map((årsak, index) => (
                <Radio ref={ref} value={årsak} key={index} {...årsakValidation}>
                    {årsak}
                </Radio>
            ))}
        </RadioGroup>
    );
};
