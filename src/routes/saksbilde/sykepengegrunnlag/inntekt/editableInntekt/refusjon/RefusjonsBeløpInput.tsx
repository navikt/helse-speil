import React from 'react';
import { useFormContext } from 'react-hook-form';

import styles from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/refusjon/RefusjonSkjema.module.scss';
import { RefusjonFormValues } from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/refusjon/useRefusjonFormField';
import { Refusjonsopplysning } from '@typer/overstyring';
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

    return (
        <>
            <label id={`refusjonsopplysninger.${index}.beløp`} className="navds-sr-only">
                Månedlig refusjon
            </label>
            <input
                className={`${styles.BeløpInput} ${
                    refusjonsopplysninger?.[index]?.beløp?.message ? styles.InputError : ''
                }`}
                ref={ref}
                aria-labelledby={`refusjonsopplysninger.${index}.beløp`}
                defaultValue={refusjonsopplysning.beløp && avrundetToDesimaler(refusjonsopplysning.beløp)}
                onBlur={(event) => {
                    const nyttBeløp = Number(event.target.value.replaceAll(' ', '').replaceAll(',', '.'));

                    if (nyttBeløp === refusjonsopplysning.beløp || Number.isNaN(nyttBeløp)) return;

                    clearErrors(`refusjonsopplysninger.${index}`);
                    setValue(`refusjonsopplysninger.${index}.beløp`, nyttBeløp);
                    void onBlur(event);
                }}
                {...inputValidation}
            />
        </>
    );
};
