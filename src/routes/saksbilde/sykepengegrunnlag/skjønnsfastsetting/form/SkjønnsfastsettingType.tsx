import React, { ReactElement } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack, Radio, RadioGroup } from '@navikt/ds-react';

import { SkjønnsfastsettingFormFields } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/form/skjønnsfastsettingForm/SkjønnsfastsettingForm';

import { Skjønnsfastsettingstype } from '../skjønnsfastsetting';

import styles from './SkjønnsfastsettingBegrunnelse.module.scss';

export const SkjønnsfastsettingType = (): ReactElement => {
    const { register, control, setValue } = useFormContext<SkjønnsfastsettingFormFields>();
    const { ref, ...typeValidation } = register('type', {
        required: 'Du må velge en type',
    });

    const onEndre = () => {
        setValue('type', null);
    };

    const valgtType = useWatch({ name: 'type', control: control });

    return (
        <div className={styles.skjønnsfastsettingBegrunnelse}>
            <RadioGroup
                className={styles.typer}
                name="type"
                legend={
                    <HStack gap="2">
                        Velg type skjønnsfastsettelse
                        {valgtType && (
                            <Button size="xsmall" variant="tertiary" onClick={onEndre}>
                                Endre
                            </Button>
                        )}
                    </HStack>
                }
            >
                {!valgtType ? (
                    skjønnsfastsettelseTyper().map((begrunnelse, index) => (
                        <div key={index}>
                            <Radio value={begrunnelse.type} ref={ref} {...typeValidation}>
                                {begrunnelse.valg}
                            </Radio>
                        </div>
                    ))
                ) : (
                    <BodyShort className={styles.valgt}>
                        <CheckmarkCircleFillIcon title="Sjekkmerke ikon" fontSize="1.5rem" />{' '}
                        {skjønnsfastsettelseTyper().find((it) => it.type === valgtType)?.valg}
                    </BodyShort>
                )}
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
