import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { useDatepicker } from '@navikt/ds-react';

import { RefusjonFormValues } from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/refusjon/hooks/useRefusjonFormField';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT, somDate, somNorskDato } from '@utils/date';

export const useFomField = (fom: string, tom: string | undefined, index: number) => {
    const { register, setValue, clearErrors } = useFormContext<RefusjonFormValues>();
    const [fomValue, setFomValue] = useState<string>(somNorskDato(fom) ?? fom);

    const fomField = register(`refusjonsopplysninger.${index}.fom`, {
        required: false,
        validate: {
            måHaGyldigFormat: (value) =>
                value == undefined || dayjs(value, ISO_DATOFORMAT, true).isValid() || 'Datoen må ha format dd.mm.åååå',
            fomKanIkkeværeEtterTom: (value) =>
                tom == undefined || dayjs(value).isSameOrBefore(tom) || 'Fom kan ikke være etter tom',
        },
    });

    const setFomField = (nyFom: string) => {
        clearErrors(`refusjonsopplysninger.${index}.fom`);
        setValue(`refusjonsopplysninger.${index}.fom`, nyFom, {
            shouldDirty: true,
            shouldTouch: true,
        });
    };

    const updateFom = (date: Date | undefined) => {
        const isoDate = dayjs(date, ISO_DATOFORMAT, true).format(ISO_DATOFORMAT);
        setFomField(isoDate);
        setFomValue(dayjs(date).format(NORSK_DATOFORMAT));
    };

    const onChangeFom = (event: React.ChangeEvent<HTMLInputElement>) => {
        const date = dayjs(event.target.value, NORSK_DATOFORMAT, true).format(ISO_DATOFORMAT);
        const validDate = date !== 'Invalid Date';
        setFomValue(event.target.value);
        setFomField(validDate ? date : event.target.value);
    };

    const fomDatePicker = useDatepicker({
        defaultSelected: somDate(fom),
        defaultMonth: somDate(fom),
        onDateChange: updateFom,
    });

    return {
        fomField: { ...fomField, onChange: onChangeFom, value: fomValue },
        fomDatePicker,
    };
};
