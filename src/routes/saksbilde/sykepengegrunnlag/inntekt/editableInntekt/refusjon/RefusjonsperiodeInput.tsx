import dayjs from 'dayjs';
import { useFormContext } from 'react-hook-form';

import { DatePicker, HStack, useRangeDatepicker } from '@navikt/ds-react';

import { Kildetype, Maybe } from '@io/graphql';
import {
    RefusjonFormFields,
    RefusjonFormValues,
} from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/refusjon/useRefusjonFormField';
import { ISO_DATOFORMAT } from '@utils/date';

interface RefusjonsperiodeInputProps {
    index: number;
    refusjonsopplysning: RefusjonFormFields;
    updateRefusjonsopplysninger: (fom: string, tom: Maybe<string>, beløp: number, index: number) => void;
}

export const RefusjonsperiodeInput = ({
    index,
    updateRefusjonsopplysninger,
    refusjonsopplysning: { fom, tom, beløp },
}: RefusjonsperiodeInputProps) => {
    const { datepickerProps, toInputProps, fromInputProps, selectedRange } = useRangeDatepicker({
        onRangeChange: (range) => {
            if (range == undefined) return;
            updateRefusjonsopplysninger(
                range.from ? dayjs(range.from).format(ISO_DATOFORMAT) : fom,
                tom ?? null,
                beløp,
                index,
            );
        },

        defaultSelected: {
            from: fom ? dayjs(fom, ISO_DATOFORMAT).toDate() : undefined,
            to: tom ? dayjs(tom, ISO_DATOFORMAT).toDate() : undefined,
        },
        defaultMonth: fom
            ? dayjs(fom, ISO_DATOFORMAT).isValid()
                ? dayjs(fom, ISO_DATOFORMAT).toDate()
                : undefined
            : undefined,
    });
    const { register } = useFormContext<RefusjonFormValues>();
    const fomField = register(`refusjonsopplysninger.${index}.fom`, {
        required: false,
        validate: {
            måHaGyldigFormat: (value) => dayjs(value, ISO_DATOFORMAT).isValid() || 'Datoen må ha format dd.mm.åååå',
            fomKanIkkeværeEtterTom: (value) =>
                tom === null || dayjs(value).isSameOrBefore(tom) || 'Fom kan ikke være etter tom',
        },
    });
    const tomField = register(`refusjonsopplysninger.${index}.tom`, {
        required: false,
        validate: {
            måHaGyldigFormat: (value) => dayjs(value, ISO_DATOFORMAT).isValid() || 'Datoen må ha format dd.mm.åååå',
            fomKanIkkeværeEtterTom: (value) =>
                tom === null || dayjs(value).isSameOrAfter(fom) || 'Tom kan ikke være før fom',
        },
    });

    return (
        <DatePicker {...datepickerProps}>
            <HStack wrap gap="4" justify="center">
                <DatePicker.Input {...fromInputProps} {...fomField} label="Fra" />
                <DatePicker.Input {...toInputProps} {...tomField} label="Til" />
            </HStack>
        </DatePicker>
    );
};
