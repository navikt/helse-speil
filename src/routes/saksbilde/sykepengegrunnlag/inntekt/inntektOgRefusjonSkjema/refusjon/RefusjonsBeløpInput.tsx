import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { TextField } from '@navikt/ds-react';

import { InntektOgRefusjonSchema } from '@/form-schemas/inntektOgRefusjonSkjema';
import styles from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/refusjon/RefusjonSkjema/RefusjonSkjema.module.scss';
import { Refusjonsopplysning } from '@typer/overstyring';
import { toKronerOgØre } from '@utils/locale';

interface RefusjonsBeløpInputProps {
    index: number;
    form: ReturnType<typeof useForm<InntektOgRefusjonSchema>>;
    refusjonsopplysning: Refusjonsopplysning;
}

export const RefusjonsBeløpInput = ({ index, form, refusjonsopplysning }: RefusjonsBeløpInputProps) => {
    const [visningsverdi, setVisningsverdi] = useState<string>(toKronerOgØre(refusjonsopplysning.beløp));

    return (
        <Controller
            name={`refusjonsperioder.${index}.beløp`}
            control={form.control}
            render={({ field, fieldState }) => (
                <TextField
                    {...field}
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

                        form.clearErrors(`refusjonsperioder.${index}`);
                        form.setValue(`refusjonsperioder.${index}.beløp`, nyttBeløp);
                        // void field.field.onBlur(event);
                    }}
                    error={!!fieldState.error?.message}
                />
            )}
        />
    );
};
