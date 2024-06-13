import styles from './SkjønnsfastsettingBegrunnelse.module.scss';
import React, { ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';

import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Radio, RadioGroup } from '@navikt/ds-react';

import { EditButton } from '@components/EditButton';

import { Skjønnsfastsettingstype } from '../skjønnsfastsetting';

export const SkjønnsfastsettingType = (): ReactElement => {
    const { register, getValues, setValue } = useFormContext();
    const { ref, ...typeValidation } = register('type', {
        required: 'Du må velge en type',
    });

    const onEndre = () => {
        setValue('type', '');
    };

    const valgtType = getValues('type');

    return (
        <div className={styles.skjønnsfastsettingBegrunnelse}>
            <RadioGroup
                className={styles.typer}
                name="type"
                legend={
                    <>
                        Velg type skjønnsfastsettelse{' '}
                        {valgtType && (
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
                        <CheckmarkCircleFillIcon title="a11y-title" fontSize="1.5rem" />{' '}
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
