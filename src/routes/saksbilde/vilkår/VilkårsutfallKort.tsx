import React, { PropsWithChildren, ReactElement, ReactNode, useId } from 'react';

import { HStack, Heading, VStack } from '@navikt/ds-react';

import { Vilkårsutfall, VilkårsutfallIkon, VilkårsutfallTag } from './vilkårsutfall';

interface VilkårsutfallKortProps {
    tittel: ReactNode;
    paragraf?: ReactNode;
    utfall: Vilkårsutfall;
    vurdertTekst?: string;
}

export function VilkårsutfallKort({
    tittel,
    paragraf,
    utfall,
    vurdertTekst,
    children,
}: PropsWithChildren<VilkårsutfallKortProps>): ReactElement {
    const tittelId = useId();

    return (
        <VStack as="section" aria-labelledby={tittelId} gap="space-16" className="w-full pt-6 not-last:pb-6">
            <HStack gap="space-12" align="center" wrap={false}>
                <span className="flex shrink-0 items-center justify-center">
                    <VilkårsutfallIkon utfall={utfall} />
                </span>
                <Heading id={tittelId} level="3" size="xsmall">
                    {tittel}
                </Heading>
                {paragraf}
            </HStack>
            <VStack gap="space-8" className="pl-9">
                <HStack gap="space-8" align="center">
                    <VilkårsutfallTag utfall={utfall}>{vurdertTekst}</VilkårsutfallTag>
                </HStack>
                {children}
            </VStack>
        </VStack>
    );
}
