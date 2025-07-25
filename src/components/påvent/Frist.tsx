import React, { Dispatch, ReactElement, SetStateAction } from 'react';

import { DatePicker, useDatepicker } from '@navikt/ds-react';

interface FristProps {
    fristDato: Date | null;
    setFristDato: Dispatch<SetStateAction<Date | null>>;
    error: string | null;
    setError: Dispatch<SetStateAction<string | null>>;
}

export const Frist = ({ fristDato, setFristDato, error, setError }: FristProps): ReactElement => {
    const { datepickerProps, inputProps } = useDatepicker({
        required: true,
        defaultSelected: fristDato ?? undefined,
        onDateChange: (dato: Date | undefined) => setFristDato(dato ?? null),
        fromDate: new Date(),
        onValidate: (val) => {
            if (val.isEmpty) setError('Oppfølgingsdato må være satt');
            else if (val.isBefore) setError('Oppfølgingsdato kan ikke være bakover i tid');
            else if (!val.isValidDate) setError('Ugyldig dato');
            else setError(null);
        },
    });

    return (
        <DatePicker {...datepickerProps}>
            <DatePicker.Input
                {...inputProps}
                label="Oppfølgingsdato"
                description="Datoen du tror oppgaven kan behandles videre"
                error={error}
            />
        </DatePicker>
    );
};
