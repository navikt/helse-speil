import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import styles from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/refusjon/RefusjonSkjema/RefusjonSkjema.module.scss';
import { RefusjonFormValues } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/refusjon/hooks/useRefusjonFormField';
import { Refusjonsopplysning } from '@typer/overstyring';
import { toKronerOgØre } from '@utils/locale';
import { avrundetToDesimaler, isNumeric } from '@utils/tall';

interface RefusjonsBeløpInputProps {
    index: number;
    refusjonsopplysning: Refusjonsopplysning;
}

export const RefusjonsBeløpInput = ({ index, refusjonsopplysning }: RefusjonsBeløpInputProps) => {
    const {
        register,
        clearErrors,
        setValue,
        formState: {
            errors: { refusjonsopplysninger },
        },
    } = useFormContext<RefusjonFormValues>();
    const { ref, onBlur, ...inputValidation } = register(`refusjonsopplysninger.${index}.beløp`, {
        required: 'Refusjonsopplysningsbeløp mangler',
        min: { value: 0, message: 'Refusjonsopplysningsbeløp må være 0 eller større' },
        validate: {
            måVæreNumerisk: (value) => isNumeric(value.toString()) || 'Refusjonsbeløp må være et beløp',
        },
        setValueAs: (value) => Number(value.toString().replaceAll(' ', '').replaceAll(',', '.')),
    });

    const defaultValue = refusjonsopplysning.beløp && avrundetToDesimaler(refusjonsopplysning.beløp);

    const [visningsverdi, setVisningsverdi] = useState<string>(toKronerOgØre(defaultValue ?? 0));

    return (
        <>
            <label id={`refusjonsopplysninger.${index}.beløp`} className="navds-sr-only">
                Månedlig refusjon
            </label>
            <input
                {...inputValidation}
                className={`${styles.BeløpInput} ${
                    refusjonsopplysninger?.[index]?.beløp?.message ? styles.InputError : ''
                }`}
                ref={ref}
                aria-labelledby={`refusjonsopplysninger.${index}.beløp`}
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

                    setVisningsverdi(Number.isNaN(nyttBeløp) ? event.target.value : toKronerOgØre(nyttBeløp));

                    if (nyttBeløp === refusjonsopplysning.beløp || Number.isNaN(nyttBeløp)) return;

                    clearErrors(`refusjonsopplysninger.${index}`);
                    setValue(`refusjonsopplysninger.${index}.beløp`, nyttBeløp);
                    void onBlur(event);
                }}
            />
        </>
    );
};
