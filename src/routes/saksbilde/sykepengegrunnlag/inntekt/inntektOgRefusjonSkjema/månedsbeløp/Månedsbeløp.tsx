import React, { useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { BodyShort, ErrorMessage, HStack, HelpText, TextField, VStack } from '@navikt/ds-react';

import { InntektOgRefusjonSchema } from '@/form-schemas/inntektOgRefusjonSkjema';
import { capitalizeName, toKronerOgØre } from '@utils/locale';
import { avrundetToDesimaler } from '@utils/tall';

import styles from './ManedsbeløpInput.module.css';

interface MånedsbeløpProps {
    månedsbeløp: number;
    kilde: string;
}

export const Månedsbeløp = ({ månedsbeløp, kilde }: MånedsbeløpProps) => {
    const form = useFormContext<InntektOgRefusjonSchema>();
    const feilmelding = form.formState.errors?.månedsbeløp?.message;
    const harEndringer = avrundetToDesimaler(form.watch('månedsbeløp')) !== avrundetToDesimaler(månedsbeløp);

    return (
        <HStack gap="2">
            <HStack gap="16" align="start">
                <BodyShort style={{ margin: '4px 0' }}>Månedsbeløp</BodyShort>
                <VStack gap="2">
                    <HStack align="center" gap="2" wrap={false}>
                        <BeløpFelt name="månedsbeløp" />

                        {kilde === 'INFOTRYGD' && (
                            <HelpText>
                                Det er ikke støtte for endring på månedsbeløp i saker som har vært delvis behandlet i
                                infotrygd
                            </HelpText>
                        )}
                        {harEndringer && <BodyShort>{toKronerOgØre(månedsbeløp)}</BodyShort>}
                    </HStack>
                    {feilmelding && (
                        <ErrorMessage showIcon size="small">
                            {feilmelding}
                        </ErrorMessage>
                    )}
                </VStack>
            </HStack>
            <BodyShort>Endringen vil gjelde fra skjæringstidspunktet</BodyShort>
        </HStack>
    );
};

export function BeløpFelt({ name }: { name: string }) {
    const { field, fieldState } = useController({ name });
    const [display, setDisplay] = useState<string>(field.value == null ? '' : toKronerOgØre(field.value));

    const parse = (val: string) => Number(val.replace(/\s/g, '').replace(',', '.'));

    const commit = () => {
        const parsed = parse(display);
        field.onChange(isNaN(parsed) ? null : parsed);
    };

    return (
        <TextField
            value={display}
            onMouseDown={(e) => {
                if (document.activeElement !== e.target) {
                    e.preventDefault();
                    (e.target as HTMLInputElement).select();
                }
            }}
            onChange={(e) => setDisplay(e.target.value)}
            onBlur={() => {
                commit();
                if (display !== '') {
                    const parsed = parse(display);
                    setDisplay(isNaN(parsed) ? display : toKronerOgØre(parsed));
                }
                field.onBlur();
            }}
            error={fieldState.error?.message != undefined}
            label={capitalizeName(name)}
            size="small"
            hideLabel
            htmlSize={12}
            className={styles.Input}
            id={fjernNorskeBokstaver(name)}
            onFocus={(e) => e.target.select()}
        />
    );

    function fjernNorskeBokstaver(input: string): string {
        if (input == null) return '';
        return input.toLowerCase().replace(/[æøå]/g, (ch) => (ch === 'æ' || ch === 'å' ? 'a' : 'o'));
    }
}
