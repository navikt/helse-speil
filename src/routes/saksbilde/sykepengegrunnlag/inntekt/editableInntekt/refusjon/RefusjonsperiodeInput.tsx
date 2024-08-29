import dayjs from 'dayjs';
import React, { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { DatePicker, HStack, useDatepicker } from '@navikt/ds-react';

import { Maybe } from '@io/graphql';
import {
    RefusjonFormFields,
    RefusjonFormValues,
} from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/refusjon/useRefusjonFormField';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';

interface RefusjonsperiodeInputProps {
    index: number;
    refusjonsopplysning: RefusjonFormFields;
    updateRefusjonsopplysninger: (fom: string, tom: Maybe<string>, beløp: number, index: number) => void;
}

export const RefusjonsperiodeInput = ({
    index,
    updateRefusjonsopplysninger,
    refusjonsopplysning: { fom, tom: rawTom, beløp },
}: RefusjonsperiodeInputProps) => {
    const tom = rawTom ?? undefined;
    const {
        formState: {
            errors: { refusjonsopplysninger },
        },
    } = useFormContext<RefusjonFormValues>();

    const [tomValue, setTomValue] = useState<string>(somNorskDato(tom ?? undefined) ?? '');

    const updateTom = (date: Date | undefined) => {
        const isoDate = dayjs(date).format(ISO_DATOFORMAT);
        updateRefusjonsopplysninger(fom, isoDate, beløp, index);
        setTomValue(dayjs(date).format(NORSK_DATOFORMAT));
    };

    const {
        fomField,
        fomDatePicker: { datepickerProps: fomDatePickerProps, inputProps: fomInputProps },
        setFomField,
    } = useFomField(fom, tom, index);
    const {
        tomField,
        tomDatePicker: { datepickerProps: tomDatePickerProps, inputProps: tomInputProps },
        setTomField,
    } = useTomField(fom, tom, index, updateTom);

    const onChangeTom = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const date = dayjs(event.target.value, NORSK_DATOFORMAT, true).format(ISO_DATOFORMAT);
            const validDate = date !== 'Invalid Date';

            setTomField(event.target.value);
            validDate && setFomField(date);
            event.currentTarget.focus();
        },
        [setFomField, setTomField],
    );

    const { ref: fomRef, ...fomFieldProps } = fomField;
    const { ref: tomRef, ...tomFieldProps } = tomField;

    return (
        <HStack wrap gap="2" justify="center" paddingBlock="2 0">
            <DatePicker {...fomDatePickerProps}>
                <DatePicker.Input
                    {...fomFieldProps}
                    {...fomInputProps}
                    setAnchorRef={fomRef}
                    label="Fra og med dato"
                    hideLabel
                    size="small"
                    error={!!refusjonsopplysninger?.[`${index}`]?.fom?.message}
                />
            </DatePicker>
            <DatePicker {...tomDatePickerProps}>
                <DatePicker.Input
                    {...tomFieldProps}
                    {...tomInputProps}
                    setAnchorRef={tomRef}
                    onChange={onChangeTom}
                    value={tomValue}
                    label="Til og med dato"
                    hideLabel
                    size="small"
                    error={!!refusjonsopplysninger?.[`${index}`]?.tom?.message}
                />
            </DatePicker>
        </HStack>
    );
};

const useFomField = (fom: string, tom: string | undefined, index: number) => {
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
        setFomField,
    };
};

const useTomField = (
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

const somDate = (dato?: string): Date | undefined =>
    dayjs(dato, ISO_DATOFORMAT, true).isValid() ? dayjs(dato, ISO_DATOFORMAT).toDate() : undefined;

const somNorskDato = (dato: string | undefined): string | undefined =>
    dato ? dayjs(somDate(dato)).format(NORSK_DATOFORMAT) : undefined;
