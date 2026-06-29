import React, { ReactElement } from 'react';
import { useController } from 'react-hook-form';

import { DatePicker, useDatepicker } from '@navikt/ds-react';

import { somIsoDato } from '@utils/date';

interface DateFieldProps {
    name: string;
    label: string;
    defaultMonth?: Date;
    disabled?: boolean;
    className?: string;
}

export function DateField({ name, label, defaultMonth, disabled, className }: DateFieldProps): ReactElement {
    const { field, fieldState } = useController({ name });

    const { datepickerProps, inputProps } = useDatepicker({
        defaultSelected: field.value,
        defaultMonth: defaultMonth ?? field.value,
        onDateChange: (date) => {
            if (!date) {
                field.onChange(null);
            } else {
                field.onChange(somIsoDato(date));
            }
        },
    });

    return (
        <DatePicker {...datepickerProps}>
            <DatePicker.Input
                {...inputProps}
                id={name.replaceAll('.', '-')}
                size="small"
                label={label}
                onBlur={field.onBlur}
                error={fieldState.error?.message != undefined}
                disabled={disabled}
                className={className}
            />
        </DatePicker>
    );
}
