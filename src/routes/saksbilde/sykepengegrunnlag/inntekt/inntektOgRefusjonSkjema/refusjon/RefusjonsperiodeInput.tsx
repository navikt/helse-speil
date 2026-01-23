import React from 'react';
import { useFormContext } from 'react-hook-form';

import { DatePicker, HStack } from '@navikt/ds-react';

import { useFomField } from './hooks/useFomField';
import { RefusjonFormFields, RefusjonFormValues } from './hooks/useRefusjonFormField';
import { useTomField } from './hooks/useTomField';

interface RefusjonsperiodeInputProps {
    index: number;
    refusjonsopplysning: RefusjonFormFields;
}

export const RefusjonsperiodeInput = ({
    index,
    refusjonsopplysning: { fom, tom: rawTom },
}: RefusjonsperiodeInputProps) => {
    const tom = rawTom ?? undefined;
    const {
        formState: {
            errors: { refusjonsopplysninger },
        },
    } = useFormContext<RefusjonFormValues>();

    const {
        fomField,
        fomDatePicker: { datepickerProps: fomDatePickerProps, inputProps: fomInputProps },
    } = useFomField(fom, tom, index);
    const {
        tomField,
        tomDatePicker: { datepickerProps: tomDatePickerProps, inputProps: tomInputProps },
    } = useTomField(fom, tom, index);

    const { ref: _fomRef, ...fomFieldProps } = fomField;
    const { ref: _tomRef, ...tomFieldProps } = tomField;

    return (
        <HStack wrap gap="space-8" justify="center">
            <DatePicker {...fomDatePickerProps} dropdownCaption>
                <DatePicker.Input
                    {...fomFieldProps}
                    onBlur={(event) => {
                        if (fomInputProps.onBlur) fomInputProps.onBlur(event);
                    }}
                    onFocus={fomInputProps.onFocus}
                    label="Fra og med dato"
                    hideLabel
                    size="small"
                    error={!!refusjonsopplysninger?.[`${index}`]?.fom?.message}
                />
            </DatePicker>
            <DatePicker {...tomDatePickerProps} dropdownCaption>
                <DatePicker.Input
                    {...tomFieldProps}
                    onBlur={(event) => {
                        if (tomInputProps.onBlur) tomInputProps.onBlur(event);
                    }}
                    onFocus={tomInputProps.onFocus}
                    label="Til og med dato"
                    hideLabel
                    size="small"
                    error={!!refusjonsopplysninger?.[`${index}`]?.tom?.message}
                />
            </DatePicker>
        </HStack>
    );
};
