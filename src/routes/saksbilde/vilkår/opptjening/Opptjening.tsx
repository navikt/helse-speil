import React, { ReactElement } from 'react';

import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { Alert, HStack, Heading, Loader, Skeleton, VStack } from '@navikt/ds-react';

import {
    ManueltVurderbarVilkårskode,
    manueltVurderbareVilkårskoder,
} from '@form-schemas/manuellVurderingAvVilkårSkjema';

import { OpptjeningVilkårsrad } from './OpptjeningVilkårsrad';
import { Opptjeningsstatus, Opptjeningsvurdering } from './useOpptjeningsvurdering';

interface OpptjeningProps {
    opptjeningsvurdering: Opptjeningsvurdering;
    readOnly: boolean;
    aktivtVilkår: ManueltVurderbarVilkårskode | null;
    onVurder: (vilkårskode: ManueltVurderbarVilkårskode) => void;
}

interface OpptjeningsgruppeIkonProps {
    status: Opptjeningsstatus;
}

const OpptjeningsgruppeIkon = ({ status }: OpptjeningsgruppeIkonProps): ReactElement => {
    switch (status) {
        case 'IkkeVurdert':
            return (
                <ExclamationmarkTriangleFillIcon
                    title="Ikke vurdert"
                    className="text-ax-text-warning-decoration"
                    fontSize="24"
                />
            );
        case 'VurdertOk':
            return (
                <CheckmarkCircleFillIcon title="Oppfylt" className="text-ax-text-success-decoration" fontSize="24" />
            );
        case 'VurdertIkkeOk':
            return (
                <XMarkOctagonFillIcon title="Ikke oppfylt" className="text-ax-text-danger-decoration" fontSize="24" />
            );
    }
};

export const Opptjening = ({
    opptjeningsvurdering,
    readOnly,
    aktivtVilkår,
    onVurder,
}: OpptjeningProps): ReactElement => {
    const { data, isLoading, isError, status, vurderingFor, avgjørendeVilkårskode } = opptjeningsvurdering;

    return (
        <VStack gap="space-16" data-testid="opptjening" className="w-full">
            <HStack align="center" gap="space-16">
                {isLoading ? (
                    <Loader size="medium" title="Henter opptjeningsvurdering" />
                ) : (
                    <span className="flex shrink-0 items-center justify-center">
                        <OpptjeningsgruppeIkon status={status} />
                    </span>
                )}
                <Heading level="3" size="xsmall">
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
};
