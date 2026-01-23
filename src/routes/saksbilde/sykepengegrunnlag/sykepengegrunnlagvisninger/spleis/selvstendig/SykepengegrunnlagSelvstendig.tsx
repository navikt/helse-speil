/*
TODO: Aksel Box migration:
Could not migrate the following:
  - borderColor=border-on-inverted
    - Use 'border-neutral' in theme 'dark'-mode.
*/
import React, { HTMLAttributes } from 'react';

import { BodyShort, Box, HStack, Heading, VStack } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { BeregnetPeriodeFragment, VilkarsgrunnlagSpleisV2 } from '@io/graphql';
import { SykepengegrunnlagSelvstendigPanel } from '@saksbilde/sykepengegrunnlag/sykepengegrunnlagvisninger/spleis/selvstendig/SykepengegrunnlagSelvstendigPanel';
import { somPenger } from '@utils/locale';

interface SykepengegrunnlagProps extends HTMLAttributes<HTMLDivElement> {
    vilkårsgrunnlag: VilkarsgrunnlagSpleisV2;
    beregnetPeriode: BeregnetPeriodeFragment;
}

export const SykepengegrunnlagSelvstendig = ({ vilkårsgrunnlag, beregnetPeriode }: SykepengegrunnlagProps) => {
    return (
        <HStack>
            <Box
                width="50%"
                paddingBlock="space-16 space-64"
                paddingInline="space-24 space-0"
                style={{ marginRight: '-3px', zIndex: 10 }}
            >
                <SykepengegrunnlagSelvstendigPanel
                    beregningsgrunnlag={vilkårsgrunnlag.beregningsgrunnlag}
                    sykepengegrunnlag={vilkårsgrunnlag.sykepengegrunnlag}
                    sykepengegrunnlagsgrense={vilkårsgrunnlag.sykepengegrunnlagsgrense}
                />
            </Box>
            <Box
                borderWidth="0 0 0 3"
                borderColor="neutral"
                background="accent-soft"
                width="50%"
                paddingBlock="space-16 space-16"
                paddingInline="space-16"
            >
                <VStack gap="space-16">
                    <HStack align="center" gap="space-8">
                        <Arbeidsgiverikon />
                        <BodyShort weight="semibold">Selvstendig næring</BodyShort>
                    </HStack>
                    <VStack gap="space-8">
                        <HStack align="center" gap="space-8">
                            <Heading size="xsmall">Pensjonsgivende inntekt siste 3 år</Heading>
                            <Kilde type="Skatteetaten">SE</Kilde>
                        </HStack>
                        <VStack>
                            {beregnetPeriode.pensjonsgivendeInntekter
                                .toSorted((a, b) => b.inntektsar - a.inntektsar)
                                .map((inntekt) => (
                                    <HStack key={inntekt.inntektsar} gap="space-16">
                                        <BodyShort weight="semibold">{inntekt.inntektsar}</BodyShort>
                                        <BodyShort>{somPenger(Number(inntekt.arligBelop))}</BodyShort>
                                    </HStack>
                                ))}
                        </VStack>
                        <HStack gap="space-24">
                            <BodyShort weight="semibold">Beregnet årsinntekt</BodyShort>
                            <BodyShort>{somPenger(Number(vilkårsgrunnlag.beregningsgrunnlag))}</BodyShort>
                        </HStack>
                    </VStack>
                </VStack>
            </Box>
        </HStack>
    );
};
