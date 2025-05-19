import React from 'react';
import { ControllerRenderProps } from 'react-hook-form';

import { DatePicker, useDatepicker } from '@navikt/ds-react';

import { TilkommenInntektSchema } from '@/form-schemas';
import { DatePeriod, DateString } from '@typer/shared';
import { dateTilNorskDato, erGyldigNorskDato, norskDatoTilDate, plussEnDag, somDate } from '@utils/date';

type ControlledDatePickerProps = {
    field: ControllerRenderProps<TilkommenInntektSchema>;
    error?: string;
    label: string;
    gyldigePerioder: DatePeriod[];
    erGyldigDato: (dato: string) => boolean;
    id: string;
};

const tidligsteDag = (dato: DateString[]) =>
    dato.reduce((previousValue, currentValue) => (currentValue < previousValue ? currentValue : previousValue));

const senesteDag = (dato: DateString[]) =>
    dato.reduce((previousValue, currentValue) => (currentValue > previousValue ? currentValue : previousValue));

export const ControlledDatePicker = ({
    field,
    error,
    label,
    gyldigePerioder,
    erGyldigDato,
    id,
}: ControlledDatePickerProps) => {
    const tidligsteFom = tidligsteDag(gyldigePerioder.map((periode) => periode.fom));
    const senesteTom = senesteDag(gyldigePerioder.map((periode) => periode.tom));
    const dagenEtterSenesteFom = plussEnDag(senesteDag(gyldigePerioder.map((periode) => periode.fom)));
    const { datepickerProps, inputProps } = useDatepicker({
        disabled: [(date) => !erGyldigDato(dateTilNorskDato(date))],
        defaultMonth: somDate(dagenEtterSenesteFom),
        defaultSelected:
            typeof field.value === 'string' && erGyldigNorskDato(field.value)
                ? norskDatoTilDate(field.value)
                : undefined,
        fromDate: somDate(tidligsteFom),
        toDate: somDate(senesteTom),
        required: true,
        onDateChange: (date) => field.onChange(date ? dateTilNorskDato(date) : ''),
    });
    return (
        <DatePicker {...datepickerProps} dropdownCaption>
            <DatePicker.Input
                {...inputProps}
                {...field}
                // Både inputProps og field har onChange-funksjon, vi kaller begge to for riktig state
                onChange={(event) => {
                    inputProps.onChange?.(event);
                    field.onChange(event);
                }}
                // Både inputProps og field har onBlur-funksjoner, vi bør kalle begge mtp. validering
                onBlur={(event) => {
                    inputProps.onBlur?.(event);
                    field.onBlur();
                }}
                // Både inputProps og field har value, vi velger formen sin
                value={field.value}
                disabled={field.disabled}
                label={label}
                error={error !== undefined}
                size="small"
                id={id}
            />
        </DatePicker>
    );
};
