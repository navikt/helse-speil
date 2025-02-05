import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { useDatepicker } from '@navikt/ds-react';

import { RefusjonFormValues } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/refusjon/hooks/useRefusjonFormField';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT, somDate, somNorskDato } from '@utils/date';

export const useTomField = (fom: string, tom: string | undefined, index: number) => {
    const { register, setValue, clearErrors } = useFormContext<RefusjonFormValues>();
    const [tomValue, setTomValue] = useState<string>(somNorskDato(tom ?? undefined) ?? '');

    const tomField = register(`refusjonsopplysninger.${index}.tom`, {
        required: false,
        validate: {
            måHaGyldigFormat: (value) =>
                value == undefined || dayjs(value, ISO_DATOFORMAT, true).isValid() || 'Datoen må ha format dd.mm.åååå',
            fomKanIkkeværeEtterTom: (value) =>
                tom == undefined || dayjs(value).isSameOrAfter(fom) || 'Tom kan ikke være før fom',
        },
    });

    const setTomField = (nyTom: string | undefined) => {
        clearErrors(`refusjonsopplysninger.${index}.tom`);
        setValue(`refusjonsopplysninger.${index}.tom`, nyTom, {
            shouldDirty: true,
            shouldTouch: true,
        });
    };

    const updateTom = (date: Date | undefined) => {
        setTomField(dayjs(date).format(ISO_DATOFORMAT));
        setTomValue(dayjs(date).format(NORSK_DATOFORMAT));
    };

    const tomDatePicker = useDatepicker({
        defaultSelected: somDate(tom),
        defaultMonth: somDate(tom) ?? somDate(fom),
        onDateChange: updateTom,
    });

    const onChangeTom = (event: React.ChangeEvent<HTMLInputElement>) => {
        const date = dayjs(event.target.value, NORSK_DATOFORMAT, true).format(ISO_DATOFORMAT);
        const validDate = date !== 'Invalid Date';
        setTomValue(event.target.value);
        setTomField(validDate ? date : undefined);
        if (validDate) tomDatePicker.setSelected(new Date(date));
    };

    return {
        tomField: { ...tomField, onChange: onChangeTom, value: tomValue },
        tomDatePicker,
    };
};
