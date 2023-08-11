import classNames from 'classnames';
import React from 'react';
import { Control, useController } from 'react-hook-form';

import { RefusjonFormValues } from './useRefusjonFormField';

import styles from './Refusjon.module.css';

interface ControlledBeløpInputProps {
    beløp: number;
    index: number;
    control: Control<RefusjonFormValues>;
}

export const ControlledBeløpInput = ({ beløp, index, control }: ControlledBeløpInputProps) => {
    const isNumeric = (input: string) => /^\d+(\.\d{1,2})?$/.test(input);
    const { field, fieldState } = useController({
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
        defaultValue: beløp && Math.round((beløp + Number.EPSILON) * 100) / 100,
    });

    const errorMessage = fieldState.error?.message;
    return (
        <input
            {...field}
            className={classNames({
                [styles.BeløpInput]: true,
                [styles.InputError]: errorMessage,
            })}
            type="number"
        />
    );
};
