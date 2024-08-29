import dayjs from 'dayjs';
import React, { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { useDatepicker } from '@navikt/ds-react';

import { RefusjonFormValues } from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/refusjon/hooks/useRefusjonFormField';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT, somDate, somNorskDato } from '@utils/date';

export const useFomField = (fom: string, tom: string | undefined, index: number) => {
    const { register, setValue } = useFormContext<RefusjonFormValues>();
    const [fomValue, setFomValue] = useState<string>(somNorskDato(fom) ?? fom);

    const setFomField = useCallback(
        (nyFom: string) => {
            setValue(`refusjonsopplysninger.${index}.fom`, nyFom);
        },
        [index, setValue],
    );

    const updateFom = useCallback(
        (date: Date | undefined) => {
            const isoDate = dayjs(date).format(ISO_DATOFORMAT);
            setFomField(isoDate);
            setFomValue(dayjs(date).format(NORSK_DATOFORMAT));
        },
        [setFomField],
    );

    const onChangeFom = (event: React.ChangeEvent<HTMLInputElement>) => {
        const date = dayjs(event.target.value, NORSK_DATOFORMAT, true).format(ISO_DATOFORMAT);
        const validDate = date !== 'Invalid Date';

        setFomValue(event.target.value);
        validDate && setFomField(date);
        event.currentTarget.focus();
    };

    const fomField = register(`refusjonsopplysninger.${index}.fom`, {
        required: false,
        validate: {
            måHaGyldigFormat: (value) =>
                value == undefined || dayjs(value, ISO_DATOFORMAT).isValid() || 'Datoen må ha format dd.mm.åååå',
            fomKanIkkeværeEtterTom: (value) =>
                tom == undefined || dayjs(value).isSameOrBefore(tom) || 'Fom kan ikke være etter tom',
        },
    });

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
