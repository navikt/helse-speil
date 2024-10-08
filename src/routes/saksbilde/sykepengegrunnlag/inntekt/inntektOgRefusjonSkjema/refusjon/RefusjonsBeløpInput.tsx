import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { TextField } from '@navikt/ds-react';

import styles from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/refusjon/RefusjonSkjema/RefusjonSkjema.module.scss';
import { RefusjonFormValues } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/refusjon/hooks/useRefusjonFormField';
import { Refusjonsopplysning } from '@typer/overstyring';
import { toKronerOgØre } from '@utils/locale';
import { isNumeric } from '@utils/tall';

interface RefusjonsBeløpInputProps {
    index: number;
    refusjonsopplysning: Refusjonsopplysning;
}

export const RefusjonsBeløpInput = ({ index, refusjonsopplysning }: RefusjonsBeløpInputProps) => {
    const {
        register,
        clearErrors,
        setValue,
        formState: {
            errors: { refusjonsopplysninger },
        },
    } = useFormContext<RefusjonFormValues>();
    const { ref, onBlur, ...inputValidation } = register(`refusjonsopplysninger.${index}.beløp`, {
        required: 'Refusjonsopplysningsbeløp mangler',
        min: { value: 0, message: 'Refusjonsopplysningsbeløp må være 0 eller større' },
        validate: {
            måVæreNumerisk: (value) => isNumeric(value.toString()) || 'Refusjonsbeløp må være et beløp',
        },
        setValueAs: (value) => Number(value.toString().replaceAll(' ', '').replaceAll(',', '.')),
    });

    const [visningsverdi, setVisningsverdi] = useState<string>(toKronerOgØre(refusjonsopplysning.beløp));

    return (
        <>
            <TextField
                {...inputValidation}
                className={styles.BeløpInput}
                label="Månedlig refusjon"
                hideLabel
                size="small"
                htmlSize={15}
                value={visningsverdi}
                onChange={(event) => {
                    setVisningsverdi(event.target.value);
                }}
                onBlur={(event) => {
                    const nyttBeløp = Number(
                        event.target.value
                            .replaceAll(' ', '')
                            .replaceAll(',', '.')
                            // Når tallet blir formattert av toKronerOgØre får det non braking space i stedet for ' '
                            .replaceAll(String.fromCharCode(160), ''),
                    );

                    setVisningsverdi(Number.isNaN(nyttBeløp) ? event.target.value : toKronerOgØre(nyttBeløp));

                    if (nyttBeløp === refusjonsopplysning.beløp || Number.isNaN(nyttBeløp)) return;

                    clearErrors(`refusjonsopplysninger.${index}`);
                    setValue(`refusjonsopplysninger.${index}.beløp`, nyttBeløp);
                    void onBlur(event);
                }}
                error={!!refusjonsopplysninger?.[index]?.beløp?.message}
            />
        </>
    );
};
