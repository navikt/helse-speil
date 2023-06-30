import classNames from 'classnames';
import React from 'react';
import { Control, FieldError, useController } from 'react-hook-form';

import { RefusjonFormValues } from './useRefusjonFormField';

import styles from './Refusjon.module.css';

interface BeløpInputProps {
    beløp: number;
    updateBeløp: (beløp: number) => void;
    clearError: () => void;
    error?: FieldError;
}

const BeløpInput = ({ beløp, updateBeløp, clearError, error }: BeløpInputProps) => (
    <input
        className={classNames({
            [styles.BeløpInput]: true,
            [styles.InputError]: error?.message,
        })}
        type="number"
        onBlur={(event) => {
            const nyttBeløp = Number(event.target.value);
            if (nyttBeløp === beløp) return;
            clearError();
            updateBeløp(Number(event.target.value));
        }}
        defaultValue={beløp && Math.round((beløp + Number.EPSILON) * 100) / 100}
    />
);

interface ControlledBeløpInputProps {
    beløp: number;
    index: number;
    control: Control<RefusjonFormValues>;
}

export const ControlledBeløpInput = ({ beløp, index, control }: ControlledBeløpInputProps) => {
    const isNumeric = (input: string) => /^\d+(\.\d{1,2})?$/.test(input);
    const { field, fieldState, formState } = useController({
        name: `refusjonsopplysninger.${index}.beløp`,
        control: control,
        rules: {
            required: true,
            validate: {
                måVæreNumerisk: (value): boolean | string =>
                    isNumeric(value.toString()) || 'Refusjonsbeløp må være et beløp',
                måVæreStort: (value) => value > 1000 || 'Tallet er for lite',
            },
        },
    });

    return (
        <>
            <input
                {...field}
                className={classNames({
                    [styles.BeløpInput]: true,
                    [styles.InputError]: fieldState.error?.message,
                })}
                type="number"
                defaultValue={beløp && Math.round((beløp + Number.EPSILON) * 100) / 100}
            />
        </>
    );
};
