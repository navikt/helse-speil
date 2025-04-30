import dayjs from 'dayjs';
import React from 'react';
import { ControllerRenderProps } from 'react-hook-form';

import { DatePicker, useDatepicker } from '@navikt/ds-react';

import { TilkommenInntektSchema } from '@/form-schemas';
import { ISO_DATOFORMAT } from '@utils/date';

type ControlledDatePickerProps = {
    field: ControllerRenderProps<TilkommenInntektSchema>;
    error?: string;
    label: string;
    defaultMonth: Date;
};

export const ControlledDatePicker = ({ field, error, label, defaultMonth }: ControlledDatePickerProps) => {
    const { datepickerProps, inputProps } = useDatepicker({
        defaultMonth: defaultMonth,
        onDateChange: (date) => {
            field.onChange(date ? dayjs(date).format(ISO_DATOFORMAT) : '');
        },
    });

    return (
        <DatePicker {...datepickerProps}>
            <DatePicker.Input
                {...inputProps}
                label={label}
                error={error !== undefined}
                size="small"
                name={field.name}
            />
        </DatePicker>
    );
};
