import dayjs from 'dayjs';
import { useFormContext } from 'react-hook-form';

import { useDatepicker } from '@navikt/ds-react';

import { RefusjonFormValues } from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/refusjon/useRefusjonFormField';
import { ISO_DATOFORMAT, somDate } from '@utils/date';

export const useTomField = (
    fom: string,
    tom: string | undefined,
    index: number,
    updateTom: (date: Date | undefined) => void,
) => {
    const { register, setValue } = useFormContext<RefusjonFormValues>();

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

    const setTomField = (nyTom: string | undefined) => {
        setValue(`refusjonsopplysninger.${index}.tom`, nyTom);
    };

    return {
        tomField,
        tomDatePicker,
        setTomField,
    };
};
