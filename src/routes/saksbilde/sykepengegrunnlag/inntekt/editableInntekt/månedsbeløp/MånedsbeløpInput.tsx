import classNames from 'classnames';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { Maybe } from '@io/graphql';
import { InntektFormFields } from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/EditableInntekt';
import { toKronerOgØre } from '@utils/locale';
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
    } = useFormContext<InntektFormFields>();

    const defaultValue = lokaltMånedsbeløp || (initialMånedsbeløp && avrundetToDesimaler(initialMånedsbeløp));

    const [visningsverdi, setVisningsverdi] = useState<string>(toKronerOgØre(defaultValue ?? 0));

    const { ref, onBlur, ...inputValidation } = register('manedsbelop', {
        disabled: skalDeaktiveres,
        required: 'Månedsbeløp mangler',
        min: { value: 0, message: 'Månedsbeløp må være 0 eller større' },
        validate: {
            måVæreNumerisk: (value) => isNumeric(value) || 'Månedsbeløp må være et beløp',
            måVæreMindreEnn: (value) =>
                Number(value) < 10000000 || 'Systemet håndterer ikke månedsbeløp over 10 millioner',
        },
        setValueAs: (value) => value.replaceAll(' ', '').replaceAll(',', '.').replaceAll(String.fromCharCode(160), ''),
    });

    return (
        <>
            <div className={styles.column}>
                <input
                    {...inputValidation}
                    className={classNames([styles.Input], {
                        [styles.InputError]: !!manedsbelop?.message,
                    })}
                    id="manedsbelop"
                    value={visningsverdi}
                    onChange={(event) => {
                        setVisningsverdi(event.target.value);
                    }}
                    ref={ref}
                    onBlur={(event) => {
                        const nyttBeløp = Number(
                            event.target.value
                                .replaceAll(' ', '')
                                .replaceAll(',', '.')
                                // Når tallet blir formattert av toKronerOgØre får det non braking space i stedet for ' '
                                .replaceAll(String.fromCharCode(160), ''),
                        );

                        setVisningsverdi(Number.isNaN(nyttBeløp) ? event.target.value : toKronerOgØre(nyttBeløp));

                        void onBlur(event);
                        void trigger('manedsbelop');
                    }}
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
