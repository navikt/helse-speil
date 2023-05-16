import classNames from 'classnames';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { FlexColumn } from '@components/Flex';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';

import styles from './MånedsbeløpInput.module.css';

interface MånedsbeløpInputProps {
    initialMånedsbeløp?: number;
    skalDeaktiveres: boolean;
    lokaltMånedsbeløp: Maybe<number>;
}

export const MånedsbeløpInput = ({
    initialMånedsbeløp,
    skalDeaktiveres,
    lokaltMånedsbeløp = null,
}: MånedsbeløpInputProps) => {
    const form = useFormContext();
    const initialMånedsbeløpRounded =
        initialMånedsbeløp && Math.round((initialMånedsbeløp + Number.EPSILON) * 100) / 100;

    const isNumeric = (input: string) => /^\d+(\.\d{1,2})?$/.test(input);

    const { ref, onBlur, ...inputValidation } = form.register('manedsbelop', {
        disabled: skalDeaktiveres,
        required: 'Månedsbeløp mangler',
        min: { value: 0, message: 'Månedsbeløp må være 0 eller større' },
        validate: {
            måVæreNumerisk: (value) => isNumeric(value) || 'Månedsbeløp må være et beløp',
            måVæreMindreEnn: (value) => value < 10000000 || 'Systemet håndterer ikke månedsbeløp over 10 millioner',
        },
        setValueAs: (value) => value.replaceAll(' ', '').replaceAll(',', '.'),
    });

    return (
        <>
            <FlexColumn>
                <input
                    className={classNames([styles.Input], {
                        [styles.InputError]: !!form.formState.errors.manedsbelop?.message,
                    })}
                    id="manedsbelop"
                    ref={ref}
                    defaultValue={lokaltMånedsbeløp || initialMånedsbeløpRounded}
                    onBlur={(event) => {
                        onBlur(event);
                        form.trigger('manedsbelop');
                    }}
                    {...inputValidation}
                />
                {form.formState.errors.manedsbelop && (
                    <label className={styles.Feilmelding} htmlFor="manedsbelop">
                        <>{form.formState.errors.manedsbelop.message}</>
                    </label>
                )}
            </FlexColumn>
            {skalDeaktiveres && (
                <FlexColumn style={{ marginTop: '4px' }}>
                    <PopoverHjelpetekst ikon={<SortInfoikon />}>
                        <p>
                            Det er ikke støtte for endring på månedsbeløp i saker som har vært delvis behandlet i
                            infotrygd
                        </p>
                    </PopoverHjelpetekst>
                </FlexColumn>
            )}
        </>
    );
};
