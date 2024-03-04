import styles from './SkjønnsfastsettingBegrunnelse.module.scss';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Radio, RadioGroup } from '@navikt/ds-react';

import { Skjønnsfastsettingstype } from '../skjønnsfastsetting';

export const SkjønnsfastsettingType = () => {
    const { register } = useFormContext();
    const { ref, ...typeValidation } = register('type', {
        required: 'Du må velge en type',
    });

    return (
        <div className={styles.skjønnsfastsettingBegrunnelse}>
            <RadioGroup className={styles.begrunnelser} name="type" legend="Velg type skjønnsfastsettelse">
                {skjønnsfastsettelseTyper().map((begrunnelse, index) => (
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

export interface SkjønnsfastsettelseTypeValg {
    valg: string;
    type: Skjønnsfastsettingstype;
}

export const skjønnsfastsettelseTyper = (): SkjønnsfastsettelseTypeValg[] => [
    {
        valg: 'Skjønnsfastsette til omregnet årsinntekt ',
        type: Skjønnsfastsettingstype.OMREGNET_ÅRSINNTEKT,
    },
    {
        valg: 'Skjønnsfastsette til rapportert årsinntekt ',
        type: Skjønnsfastsettingstype.RAPPORTERT_ÅRSINNTEKT,
    },
    {
        valg: 'Skjønnsfastsette til annet ',
        type: Skjønnsfastsettingstype.ANNET,
    },
];
