import styles from './SkjønnsfastsettingBegrunnelse.module.scss';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useRecoilValue } from 'recoil';

import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Radio, RadioGroup } from '@navikt/ds-react';

import { EditButton } from '@components/EditButton';

import { skjønnsfastsettingMaler } from '../state';

export const SkjønnsfastsettingÅrsak = () => {
    const { formState, register, setValue, resetField, getValues } = useFormContext();
    const årsaker = useRecoilValue(skjønnsfastsettingMaler).flatMap((it) => it.arsak);
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
                        <CheckmarkCircleFillIcon title="a11y-title" fontSize="1.5rem" /> {valgtÅrsak}
                    </BodyShort>
                )}
            </RadioGroup>
        </>
    );
};
