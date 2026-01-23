import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack, Radio, RadioGroup } from '@navikt/ds-react';

import { SkjønnsfastsettingMal } from '@external/sanity';
import { SkjønnsfastsettingFormFields } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/form/skjønnsfastsettingForm/SkjønnsfastsettingForm';

import styles from './SkjønnsfastsettingBegrunnelse.module.scss';

type Props = {
    maler: SkjønnsfastsettingMal[] | undefined;
};

export const SkjønnsfastsettingÅrsak = ({ maler }: Props) => {
    const { formState, register, setValue, control } = useFormContext<SkjønnsfastsettingFormFields>();
    const årsaker = maler?.flatMap((it) => it.arsak) ?? [];
    const { ref, ...årsakValidation } = register('årsak', { required: 'Du må velge en årsak' });

    const resetType = () => {
        setValue('type', null);
    };

    const onEndre = () => {
        setValue('årsak', '');
    };

    const valgtÅrsak = useWatch({ name: 'årsak', control: control });

    return (
        <>
            <RadioGroup
                className={styles.årsak}
                name="årsak"
                error={formState.errors.årsak ? (formState.errors.årsak.message as string) : null}
                legend={
                    <HStack gap="space-8">
                        Årsak til skjønnsfastsettelse
                        {valgtÅrsak && (
                            <Button type="button" size="xsmall" variant="tertiary" onClick={onEndre}>
                                Endre
                            </Button>
                        )}
                    </HStack>
                }
                onChange={resetType}
            >
                {!valgtÅrsak ? (
                    årsaker.map((årsak, index) => (
                        <Radio ref={ref} value={årsak} key={index} {...årsakValidation}>
                            {årsak}
                        </Radio>
                    ))
                ) : (
                    <BodyShort className={styles.valgt}>
                        <CheckmarkCircleFillIcon title="Sjekkmerke ikon" fontSize="1.5rem" /> {valgtÅrsak}
                    </BodyShort>
                )}
            </RadioGroup>
        </>
    );
};
