import React, { ReactElement } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { DatePicker, useDatepicker } from '@navikt/ds-react';

import { PåVentSkjema } from '@/form-schemas/påVentSkjema';
import { plussEttÅr } from '@utils/date';

export const Frist = (): ReactElement => {
    const { control } = useFormContext<PåVentSkjema>();
    const { field, fieldState } = useController({ name: 'frist', control });
    const idag = new Date();

    const { datepickerProps, inputProps } = useDatepicker({
        defaultSelected: field.value ?? undefined,
        onDateChange: (date) => {
            field.onChange(date ?? null);
        },
        fromDate: idag,
        toDate: plussEttÅr(idag),
    });

    return (
        <DatePicker {...datepickerProps} dropdownCaption>
            <DatePicker.Input
                {...inputProps}
                label="Oppfølgingsdato"
                description="Datoen du tror oppgaven kan behandles videre"
                onBlur={field.onBlur}
                error={fieldState.error?.message}
            />
        </DatePicker>
    );
};
