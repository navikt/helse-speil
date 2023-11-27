import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import DatePicker from '@navikt/ds-react/esm/date/datepicker/DatePicker';
import { useDatepicker } from '@navikt/ds-react/esm/date/hooks/useDatepicker';

export const Frist = () => {
    const { setValue } = useFormContext();
    const [hasError, setHasError] = useState(false);
    const { datepickerProps, inputProps } = useDatepicker({
        fromDate: new Date(),
        onValidate: (val) => {
            setHasError(!val.isValidDate && !val.isEmpty);
        },
    });
    return (
        <div style={{ marginBottom: '2rem' }}>
            <DatePicker {...datepickerProps}>
                <DatePicker.Input
                    {...inputProps}
                    label="Tidsfrist"
                    error={hasError && 'Noe er feil'}
                    onSelect={(e) => setValue('frist', (e.target as HTMLSelectElement)?.value ?? null)}
                />
            </DatePicker>
        </div>
    );
};
