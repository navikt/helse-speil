import dayjs from 'dayjs';
import React, { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { DatePicker, HStack } from '@navikt/ds-react';

import { Maybe } from '@io/graphql';
import { useFomField } from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/refusjon/useFomField';
import {
    RefusjonFormFields,
    RefusjonFormValues,
} from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/refusjon/useRefusjonFormField';
import { useTomField } from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/refusjon/useTomField';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT, somNorskDato } from '@utils/date';

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
