import React from 'react';
import { useFormContext } from 'react-hook-form';

import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Radio, RadioGroup } from '@navikt/ds-react';

import { EditButton } from '@components/EditButton';
import { SkjønnsfastsettingMal } from '@external/sanity';

import styles from './SkjønnsfastsettingBegrunnelse.module.scss';

type Props = {
    maler: SkjønnsfastsettingMal[] | undefined;
};

export const SkjønnsfastsettingÅrsak = ({ maler }: Props) => {
    const { formState, register, setValue, resetField, getValues } = useFormContext();
    const årsaker = maler?.flatMap((it) => it.arsak) ?? [];
    const { ref, ...årsakValidation } = register('årsak', { required: 'Du må velge en årsak' });

    const resetType = () => {
        setValue('type', '');
    };

    const onEndre = () => {
        resetField('årsak');
    };

    const valgtÅrsak = getValues('årsak');

    return (
        <>
            <RadioGroup
                className={styles.årsak}
                name="årsak"
                error={formState.errors.årsak ? (formState.errors.årsak.message as string) : null}
                legend={
                    <>
                        Årsak til skjønnsfastsettelse{' '}
                        {valgtÅrsak && (
                            <EditButton
                                className={styles.endringsknapp}
                                isOpen={false}
                                openText=""
                                closedText="Endre"
                                onOpen={onEndre}
                                onClose={() => false}
                                closedIcon={<></>}
                                openIcon={<></>}
                            />
                        )}
                    </>
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
