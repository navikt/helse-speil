import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useRecoilValue } from 'recoil';

import { Radio, RadioGroup } from '@navikt/ds-react';

import { sanityMaler } from '@utils/featureToggles';

import { skjønnsfastsettingMaler } from '../state';

import styles from './SkjønnsfastsettingBegrunnelse.module.css';

export const SkjønnsfastsettingÅrsak = () => {
    const { formState, register } = useFormContext();
    const årsakerFraSanity = useRecoilValue(skjønnsfastsettingMaler).flatMap((it) => it.arsak);
    const { ref, ...årsakValidation } = register('årsak', { required: 'Du må velge en årsak' });

    const årsaker = sanityMaler ? årsakerFraSanity : årsakerGammel;

    return (
        <RadioGroup
            className={styles.årsak}
            name="årsak"
            error={formState.errors.årsak ? (formState.errors.årsak.message as string) : null}
            legend="Årsak til skjønnsfastsettelse"
        >
            {årsaker.map((årsak, index) => (
                <Radio ref={ref} value={årsak} key={index} {...årsakValidation}>
                    {årsak}
                </Radio>
            ))}
        </RadioGroup>
    );
};

const årsakerGammel = ['Skjønnsfastsettelse ved mer enn 25 % avvik (§ 8-30, andre avsnitt)'];
