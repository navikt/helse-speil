import React from 'react';
import { useFormContext } from 'react-hook-form';

import { DatePicker, HStack } from '@navikt/ds-react';

import { useFomField } from './useFomField';
import { RefusjonFormFields, RefusjonFormValues } from './useRefusjonFormField';
import { useTomField } from './useTomField';

interface RefusjonsperiodeInputProps {
    index: number;
    refusjonsopplysning: RefusjonFormFields;
}

export const RefusjonsperiodeInput = ({
    index,
    refusjonsopplysning: { fom, tom: rawTom, beløp },
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
                    label="Til og med dato"
                    hideLabel
                    size="small"
                    error={!!refusjonsopplysninger?.[`${index}`]?.tom?.message}
                />
            </DatePicker>
        </HStack>
    );
};
