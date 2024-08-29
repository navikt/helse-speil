import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { useDatepicker } from '@navikt/ds-react';

import { RefusjonFormValues } from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/refusjon/useRefusjonFormField';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT, somDate, somNorskDato } from '@utils/date';

export const useTomField = (fom: string, tom: string | undefined, index: number) => {
    const { register, setValue } = useFormContext<RefusjonFormValues>();
    const [tomValue, setTomValue] = useState<string>(somNorskDato(tom ?? undefined) ?? '');

    const setTomField = (nyTom: string | undefined) => {
        setValue(`refusjonsopplysninger.${index}.tom`, nyTom);
    };

    const updateTom = (date: Date | undefined) => {
        const isoDate = dayjs(date).format(ISO_DATOFORMAT);
        setTomField(isoDate);
        setTomValue(dayjs(date).format(NORSK_DATOFORMAT));
    };

    const onChangeTom = (event: React.ChangeEvent<HTMLInputElement>) => {
        const date = dayjs(event.target.value, NORSK_DATOFORMAT, true).format(ISO_DATOFORMAT);
        const validDate = date !== 'Invalid Date';

        setTomField(event.target.value);
        validDate && setTomField(date);
        event.currentTarget.focus();
    };

    const tomField = register(`refusjonsopplysninger.${index}.tom`, {
        required: false,
        validate: {
            måHaGyldigFormat: (value) =>
                value == undefined || dayjs(value, ISO_DATOFORMAT).isValid() || 'Datoen må ha format dd.mm.åååå',
            fomKanIkkeværeEtterTom: (value) =>
                tom == undefined || dayjs(value).isSameOrAfter(fom) || 'Tom kan ikke være før fom',
        },
    });

    const tomDatePicker = useDatepicker({
        defaultSelected: somDate(tom),
        defaultMonth: somDate(tom) ?? somDate(fom),
        onDateChange: updateTom,
    });

    return {
        tomField: { ...tomField, onChange: onChangeTom, value: tomValue },
        tomDatePicker,
    };
};
