import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { BodyShort, ErrorMessage, HStack, HelpText, TextField, VStack } from '@navikt/ds-react';

import { InntektOgRefusjonSchema } from '@/form-schemas/inntektOgRefusjonSkjema';
import { kronerOgØreTilNumber, toKronerOgØre } from '@utils/locale';
import { avrundetToDesimaler } from '@utils/tall';

import styles from '../InntektOgRefusjonSkjema.module.css';

interface MånedsbeløpProps {
    form: ReturnType<typeof useForm<InntektOgRefusjonSchema>>;
    månedsbeløp: number;
    kilde: string;
}

export const Månedsbeløp = ({ form, månedsbeløp, kilde }: MånedsbeløpProps) => {
    const feilmelding = form.formState.errors?.månedsbeløp?.message;
    const [månedsbeløpVisningsverdi, setMånedsbeløpVisningsverdi] = useState<string>(toKronerOgØre(månedsbeløp));
    const harEndringer = avrundetToDesimaler(form.watch('månedsbeløp')) !== avrundetToDesimaler(månedsbeløp);

    return (
        <HStack gap="2">
            <HStack gap="8" align="start">
                <BodyShort style={{ margin: '4px 0' }}>Månedsbeløp</BodyShort>
                <VStack gap="2">
                    <HStack align="center" gap="2" wrap={false}>
                        <Controller
                            control={form.control}
                            name="månedsbeløp"
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    value={månedsbeløpVisningsverdi}
                                    onChange={(event) => {
                                        const nyttBeløp = kronerOgØreTilNumber(event.target.value);
                                        setMånedsbeløpVisningsverdi(event.target.value);
                                        field.onChange(nyttBeløp);
                                    }}
                                    onBlur={(event) => {
                                        const nyttBeløp = kronerOgØreTilNumber(event.target.value);
                                        setMånedsbeløpVisningsverdi(
                                            Number.isNaN(nyttBeløp) ? event.target.value : toKronerOgØre(nyttBeløp),
                                        );
                                        field.onBlur();
                                    }}
                                    error={fieldState.error?.message != undefined}
                                    className={styles.Input}
                                    htmlSize={12}
                                    label="Månedsbeløp"
                                    size="small"
                                    hideLabel
                                    id="manedsbelop"
                                    onFocus={(e) => e.target.select()}
                                />
                            )}
                        />
                        {kilde === 'INFOTRYGD' && (
                            <HelpText>
                                Det er ikke støtte for endring på månedsbeløp i saker som har vært delvis behandlet i
                                infotrygd
                            </HelpText>
                        )}
                        {harEndringer && (
                            <BodyShort className={styles.OpprinneligMånedsbeløp}>
                                {toKronerOgØre(månedsbeløp)}
                            </BodyShort>
                        )}
                    </HStack>
                    {feilmelding && (
                        <ErrorMessage showIcon size="small" className={styles.error}>
                            {feilmelding}
                        </ErrorMessage>
                    )}
                </VStack>
            </HStack>
            <BodyShort className={styles.Warning}>Endringen vil gjelde fra skjæringstidspunktet</BodyShort>
        </HStack>
    );
};
