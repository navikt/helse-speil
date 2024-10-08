import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { HStack, HelpText, TextField } from '@navikt/ds-react';

import { Maybe } from '@io/graphql';
import { InntektFormFields } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/InntektOgRefusjonSkjema';
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
        setValue,
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
        <HStack align="center" gap="2" wrap={false}>
            <TextField
                {...inputValidation}
                className={styles.Input}
                htmlSize={12}
                label="Månedsbeløp"
                hideLabel
                id="manedsbelop"
                size="small"
                value={visningsverdi}
                onChange={(event) => {
                    setVisningsverdi(event.target.value);
                }}
                onBlur={(event) => {
                    const nyttBeløp = Number(
                        event.target.value
                            .replaceAll(' ', '')
                            .replaceAll(',', '.')
                            // Når tallet blir formattert av toKronerOgØre får det non braking space i stedet for ' '
                            .replaceAll(String.fromCharCode(160), ''),
                    );

                    const value = Number.isNaN(nyttBeløp) ? event.target.value : toKronerOgØre(nyttBeløp);
                    setVisningsverdi(value);
                    setValue('manedsbelop', value);

                    void onBlur(event);
                    void trigger('manedsbelop');
                }}
                ref={ref}
                error={!!manedsbelop?.message}
            />
            {skalDeaktiveres && (
                <HelpText>
                    Det er ikke støtte for endring på månedsbeløp i saker som har vært delvis behandlet i infotrygd
                </HelpText>
            )}
        </HStack>
    );
};
