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

    const { ref: fomRef, ...fomFieldProps } = fomField;
    const { ref: tomRef, ...tomFieldProps } = tomField;

    return (
        <HStack wrap gap="2" justify="center">
            <DatePicker {...fomDatePickerProps}>
                <DatePicker.Input
                    {...fomInputProps}
                    {...fomFieldProps}
                    label="Fra og med dato"
                    hideLabel
                    size="small"
                    error={!!refusjonsopplysninger?.[`${index}`]?.fom?.message}
                />
            </DatePicker>
            <DatePicker {...tomDatePickerProps}>
                <DatePicker.Input
                    {...tomInputProps}
                    {...tomFieldProps}
                    label="Til og med dato"
                    hideLabel
                    size="small"
                    error={!!refusjonsopplysninger?.[`${index}`]?.tom?.message}
                />
            </DatePicker>
        </HStack>
    );
};
