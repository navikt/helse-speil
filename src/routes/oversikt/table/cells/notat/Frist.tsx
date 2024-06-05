import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { DatePicker, useDatepicker } from '@navikt/ds-react';

import { NORSK_DATOFORMAT } from '@utils/date';

export const Frist = () => {
    const { setValue, register, formState } = useFormContext();
    const [hasError, setHasError] = useState(false);
    const { datepickerProps, inputProps } = useDatepicker({
        fromDate: new Date(),
        onValidate: (val) => {
            setHasError(!val.isValidDate);
        },
        onDateChange: (value) => setValue('frist', dayjs(value).format(NORSK_DATOFORMAT)),
    });

    return (
        <DatePicker {...datepickerProps}>
            <DatePicker.Input
                {...register('frist', {
                    required: 'Frist må være satt',
                    validate: (value) => {
                        console.log(value, dayjs(value, NORSK_DATOFORMAT).isValid());
                        return dayjs(value, NORSK_DATOFORMAT).isValid() || 'Ugyldig dato';
                    },
                })}
                {...inputProps}
                label="Tidsfrist"
                error={(hasError || formState.errors?.frist) && (formState.errors?.frist?.message as string)}
            />
        </DatePicker>
    );
};
