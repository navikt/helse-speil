'use client';

import React, { ReactElement, useState } from 'react';
import { Controller } from 'react-hook-form';

import { HStack, Radio, RadioGroup, VStack } from '@navikt/ds-react';
import { Box } from '@navikt/ds-react/Box';

import { LeggTilAndreYtelserView } from '@saksbilde/andreYtelser/LeggTilAndreYtelserView';
import { LeggTilTilkommenInntektSkjemaFelter } from '@saksbilde/tilkommenInntekt/skjema/LeggTilTilkommenInntektSkjemaV2';
import { TilkommenInntektSkjemaTabell } from '@saksbilde/tilkommenInntekt/skjema/TilkommenInntektSkjemaTabell';
import { useLeggTilTilkommenInntektSkjema } from '@saksbilde/tilkommenInntekt/skjema/useLeggTilTilkommenInntektSkjema';
import { finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';

type LeggTilType = 'tilkommen-inntekt' | 'annen-ytelse' | null;
export const LeggTilPeriodeView = (): ReactElement => {
    const [type, setType] = useState<LeggTilType>(null);
    const tilkommenInntektSkjema = useLeggTilTilkommenInntektSkjema();
    const gyldigPeriode = tilkommenInntektSkjema?.gyldigPeriode;

    return (
        <Box
            background="neutral-soft"
            borderWidth="0 0 0 3"
            borderColor="accent"
            marginBlock="space-16"
            width="fit-content"
            minWidth="calc(var(--ax-space-128) * 4)"
            maxWidth="100%"
            style={{ marginInlineEnd: 'auto' }}
        >
            <HStack wrap={false} align="start" gap="space-16">
                <VStack gap="space-16" paddingBlock="space-16" paddingInline="space-40">
                    <RadioGroup
                        legend="Legg til periode"
                        size="small"
                        value={type}
                        onChange={(val) => setType(val as LeggTilType)}
                    >
                        <Radio value="tilkommen-inntekt">Tilkommen inntekt</Radio>
                        <Radio value="annen-ytelse">Annen ytelse</Radio>
                    </RadioGroup>
                    {type === 'tilkommen-inntekt' && tilkommenInntektSkjema && (
                        <LeggTilTilkommenInntektSkjemaFelter skjema={tilkommenInntektSkjema} />
                    )}
                    {type === 'annen-ytelse' && <LeggTilAndreYtelserView />}
                </VStack>
                {type === 'tilkommen-inntekt' && tilkommenInntektSkjema && gyldigPeriode && (
                    <Controller
                        control={tilkommenInntektSkjema.form.control}
                        name="ekskluderteUkedager"
                        render={({ field, fieldState }) => (
                            <TilkommenInntektSkjemaTabell
                                inntektsforhold={finnAlleInntektsforhold(tilkommenInntektSkjema.person)}
                                periode={gyldigPeriode}
                                error={fieldState.error !== undefined}
                                ekskluderteUkedager={field.value ?? []}
                                setEkskluderteUkedager={(ukedager) => {
                                    field.onChange(ukedager);
                                    field.onBlur();
                                }}
                            />
                        )}
                    />
                )}
            </HStack>
        </Box>
    );
};
