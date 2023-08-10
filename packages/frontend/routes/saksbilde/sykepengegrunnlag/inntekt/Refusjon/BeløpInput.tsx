import React from 'react';
import { Control, useController } from 'react-hook-form';

import { TextField } from '@navikt/ds-react';

import { RefusjonFormValues } from './useRefusjonFormField';

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
            },
        },
        defaultValue: beløp && Math.round((beløp + Number.EPSILON) * 100) / 100,
    });

    return (
        <TextField
            {...field}
            label="Refusjonsbeløp"
            hideLabel
            size="small"
            error={fieldState.error?.message}
            type="number"
        />
    );
};
