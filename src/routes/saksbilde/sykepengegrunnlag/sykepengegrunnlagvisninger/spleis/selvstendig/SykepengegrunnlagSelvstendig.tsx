import React, { HTMLAttributes } from 'react';

import { BodyShort, Box, Detail, HStack, VStack } from '@navikt/ds-react';

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
            <Box width="50%" paddingBlock="4" paddingInline="4 0">
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
                paddingBlock="16 4"
                paddingInline="4"
            >
                <VStack gap="8">
                    <HStack align="center" gap="2">
                        <Arbeidsgiverikon />
                        <BodyShort weight="semibold">Selvstendig næring</BodyShort>
                    </HStack>
                    <Box width="65%">
                        <HStack align="center" gap="2">
                            <Detail>FERDIGLIGNET INNTEKT SISTE 3 ÅR</Detail>
                            <Kilde type="Skatteetaten">SE</Kilde>
                        </HStack>
                        {beregnetPeriode.pensjonsgivendeInntekter
                            .toSorted((a, b) => b.inntektsar - a.inntektsar)
                            .map((inntekt) => (
                                <HStack key={inntekt.inntektsar} justify="space-between" paddingInline="2 0">
                                    <BodyShort weight="semibold">{inntekt.inntektsar}</BodyShort>
                                    <BodyShort>{somPenger(Number(inntekt.arligBelop))}</BodyShort>
                                </HStack>
                            ))}
                    </Box>
                </VStack>
            </Box>
        </HStack>
    );
};
