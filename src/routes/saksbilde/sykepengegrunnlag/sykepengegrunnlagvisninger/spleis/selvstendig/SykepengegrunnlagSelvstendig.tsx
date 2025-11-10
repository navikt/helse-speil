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
            <Box width="50%" paddingBlock="4 16" paddingInline="6 0" style={{ marginRight: '-3px', zIndex: 10 }}>
                <SykepengegrunnlagSelvstendigPanel
                    beregningsgrunnlag={vilkårsgrunnlag.beregningsgrunnlag}
                    sykepengegrunnlag={vilkårsgrunnlag.sykepengegrunnlag}
                    sykepengegrunnlagsgrense={vilkårsgrunnlag.sykepengegrunnlagsgrense}
                />
            </Box>
            <Box
                borderWidth="0 0 0 3"
                borderColor="border-on-inverted"
                background="surface-selected"
                width="50%"
                paddingBlock="4 4"
                paddingInline="4"
            >
                <VStack gap="4">
                    <HStack align="center" gap="2">
                        <Arbeidsgiverikon />
                        <BodyShort weight="semibold">Selvstendig næring</BodyShort>
                    </HStack>
                    <VStack gap="2">
                        <HStack align="center" gap="2">
                            <Heading size="xsmall">Pensjonsgivende inntekt siste 3 år</Heading>
                            <Kilde type="Skatteetaten">SE</Kilde>
                        </HStack>
                        <VStack>
                            {beregnetPeriode.pensjonsgivendeInntekter
                                .toSorted((a, b) => b.inntektsar - a.inntektsar)
                                .map((inntekt) => (
                                    <HStack key={inntekt.inntektsar} gap="4">
                                        <BodyShort weight="semibold">{inntekt.inntektsar}</BodyShort>
                                        <BodyShort>{somPenger(Number(inntekt.arligBelop))}</BodyShort>
                                    </HStack>
                                ))}
                        </VStack>
                        <HStack gap="6">
                            <BodyShort weight="semibold">Beregnet årsinntekt</BodyShort>
                            <BodyShort>{somPenger(Number(vilkårsgrunnlag.beregningsgrunnlag))}</BodyShort>
                        </HStack>
                    </VStack>
                </VStack>
            </Box>
        </HStack>
    );
};
