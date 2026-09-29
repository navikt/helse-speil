import React, { ReactElement, useId } from 'react';

import { Alert, HStack, Heading, Loader, Skeleton, VStack } from '@navikt/ds-react';

import {
    ManueltVurderbarVilkårskode,
    manueltVurderbareVilkårskoder,
} from '@form-schemas/manuellVurderingAvVilkårSkjema';
import { VilkårsutfallIkon } from '@saksbilde/vilkår/vilkårsutfall';

import { OpptjeningVilkårsrad } from './OpptjeningVilkårsrad';
import { Opptjeningsvurdering } from './useOpptjeningsvurdering';

interface OpptjeningProps {
    opptjeningsvurdering: Opptjeningsvurdering;
    readOnly: boolean;
    aktivtVilkår: ManueltVurderbarVilkårskode | null;
    onVurder: (vilkårskode: ManueltVurderbarVilkårskode) => void;
}

export function Opptjening({ opptjeningsvurdering, readOnly, aktivtVilkår, onVurder }: OpptjeningProps): ReactElement {
    const { data, isLoading, isError, utfall, vurderingFor, avgjørendeVilkårskode } = opptjeningsvurdering;
    const tittelId = useId();

    return (
        <VStack as="section" aria-labelledby={tittelId} gap="space-4" className="w-full">
            <HStack align="center" gap="space-12">
                {isLoading ? (
                    <Loader size="medium" title="Henter opptjeningsvurdering" />
                ) : (
                    <span className="flex shrink-0 items-center justify-center">
                        <VilkårsutfallIkon utfall={utfall} />
                    </span>
                )}
                <Heading id={tittelId} level="3" size="xsmall">
                    Opptjeningstid
                </Heading>
            </HStack>
            <VStack gap="space-0" className="w-full border-t border-ax-border-neutral-subtle">
                {isLoading ? (
                    <VStack gap="space-16" paddingBlock="space-16" marginInline="space-16 space-0">
                        {manueltVurderbareVilkårskoder.map((vilkårskode) => (
                            <Skeleton key={vilkårskode} variant="rounded" height={56} />
                        ))}
                    </VStack>
                ) : isError || !data ? (
                    <Alert variant="error" size="small">
                        Kunne ikke hente opptjeningsvurderingen
                    </Alert>
                ) : (
                    <VStack as="ul" padding="space-0" margin="space-0" marginInline="space-16 space-0">
                        {manueltVurderbareVilkårskoder.map((vilkårskode) => (
                            <OpptjeningVilkårsrad
                                key={vilkårskode}
                                vilkårskode={vilkårskode}
                                vurdering={vurderingFor(vilkårskode)}
                                erAvgjørende={avgjørendeVilkårskode === vilkårskode}
                                readOnly={readOnly}
                                erAktiv={aktivtVilkår === vilkårskode}
                                onVurder={() => onVurder(vilkårskode)}
                            />
                        ))}
                    </VStack>
                )}
            </VStack>
        </VStack>
    );
}
