import classNames from 'classnames';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { Maybe } from '@io/graphql';
import { avrundetToDesimaler, isNumeric } from '@utils/tall';

import styles from './ManedsbeløpInput.module.css';

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
    const {
        register,
        formState: {
            errors: { manedsbelop },
        },
        trigger,
    } = useFormContext();

    const { ref, onBlur, ...inputValidation } = register('manedsbelop', {
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
            <div className={styles.column}>
                <input
                    className={classNames([styles.Input], {
                        [styles.InputError]: !!manedsbelop?.message,
                    })}
                    id="manedsbelop"
                    ref={ref}
                    defaultValue={lokaltMånedsbeløp || (initialMånedsbeløp && avrundetToDesimaler(initialMånedsbeløp))}
                    onBlur={(event) => {
                        void onBlur(event);
                        void trigger('manedsbelop');
                    }}
                    {...inputValidation}
                />
                {manedsbelop && (
                    <label className={styles.Feilmelding} htmlFor="manedsbelop">
                        <>{manedsbelop.message}</>
                    </label>
                )}
            </div>
            {skalDeaktiveres && (
                <div className={classNames(styles.column, styles['column__deaktiveres'])}>
                    <PopoverHjelpetekst ikon={<SortInfoikon />}>
                        <p>
                            Det er ikke støtte for endring på månedsbeløp i saker som har vært delvis behandlet i
                            infotrygd
                        </p>
                    </PopoverHjelpetekst>
                </div>
            )}
        </>
    );
};
