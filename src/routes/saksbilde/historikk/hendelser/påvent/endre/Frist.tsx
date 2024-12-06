import React, { Dispatch, ReactElement, SetStateAction, useState } from 'react';

import { DatePicker, useDatepicker } from '@navikt/ds-react';

interface FristProps {
    fristDato: Date | null;
    setFristDato: Dispatch<SetStateAction<Date | null>>;
}

export const Frist = ({ fristDato, setFristDato }: FristProps): ReactElement => {
    const [error, setError] = useState<string | null>(null);
    const { datepickerProps, inputProps } = useDatepicker({
        required: true,
        defaultSelected: fristDato ?? undefined,
        onDateChange: (dato: Date | undefined) => setFristDato(dato ?? null),
        fromDate: new Date(),
        onValidate: (val) => {
            if (val.isEmpty) setError('Frist må være satt');
            else if (val.isBefore) setError('Frist kan ikke være bakover i tid');
            else if (!val.isValidDate) setError('Ugyldig dato');
            else setError(null);
        },
    });

    return (
        <DatePicker {...datepickerProps}>
            <DatePicker.Input {...inputProps} label="Tidsfrist" error={error} />
        </DatePicker>
    );
};
