import React, { ReactElement, useId } from 'react';

import { Alert, HStack, Heading, Loader, Skeleton, VStack } from '@navikt/ds-react';

import {
    ManueltVurderbarVilkårskode,
    manueltVurderbareVilkårskoder,
} from '@form-schemas/manuellVurderingAvVilkårSkjema';
import { useErCoachFagkoordinatorEllerSupersaksbehandler } from '@hooks/brukerrolleHooks';
import { ApiVilkårskode } from '@io/rest/generated/vilkarsproving.schemas';
import { VilkårsutfallIkon } from '@saksbilde/vilkår/vilkårsutfall';
import { kanVurdereLikestilteYtelser } from '@utils/featureToggles';

import { EndringsloggOpptjeningButton } from './EndringsloggOpptjeningButton';
import { LikestiltYtelseVilkårsrad } from './LikestiltYtelseVilkårsrad';
import { OpptjeningVilkårsrad } from './OpptjeningVilkårsrad';
import { VurderAutomatiskPåNyttKnapp } from './VurderAutomatiskPåNyttKnapp';
import { Opptjeningsendring } from './useOpptjeningshistorikk';
import { Opptjeningsvurdering } from './useOpptjeningsvurdering';

interface OpptjeningProps {
    personPseudoId: string;
    opptjeningsvurdering: Opptjeningsvurdering;
    endringer: Opptjeningsendring[];
    readOnly: boolean;
    aktivtVilkår: ManueltVurderbarVilkårskode | null;
    onVurder: (vilkårskode: ManueltVurderbarVilkårskode) => void;
}

export function Opptjening({
    personPseudoId,
    opptjeningsvurdering,
    endringer,
    readOnly,
    aktivtVilkår,
    onVurder,
}: OpptjeningProps): ReactElement {
    const { data, isLoading, isError, utfall, vurderingFor, avgjørendeVilkårskode } = opptjeningsvurdering;
    const tittelId = useId();
    const erCoachFagkoordinatorEllerSupersaksbehandler = useErCoachFagkoordinatorEllerSupersaksbehandler();

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
                <EndringsloggOpptjeningButton endringer={endringer} />
                {!readOnly && erCoachFagkoordinatorEllerSupersaksbehandler && data && (
                    <VurderAutomatiskPåNyttKnapp
                        personPseudoId={personPseudoId}
                        skjæringstidspunkt={data.skjæringstidspunkt}
                        onVurdert={opptjeningsvurdering.onOverstyrt}
                        onVenterPåGrunnlag={opptjeningsvurdering.onVenterPåGrunnlag}
                    />
                )}
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
                        <OpptjeningVilkårsrad
                            vilkårskode={ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER}
                            vurdering={vurderingFor(ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER)}
                            erAvgjørende={avgjørendeVilkårskode === ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER}
                            readOnly={readOnly}
                            erAktiv={aktivtVilkår === ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER}
                            onVurder={() => onVurder(ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER)}
                        />
                        {kanVurdereLikestilteYtelser() && (
                            <LikestiltYtelseVilkårsrad
                                vurderingFor={vurderingFor}
                                erAvgjørende={
                                    !!avgjørendeVilkårskode &&
                                    likestiltYtelseVilkårskoder.includes(avgjørendeVilkårskode)
                                }
                                readOnly={readOnly}
                                erAktiv={aktivtVilkår === ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE_MINST_4_UKER}
                                onVurder={() => onVurder(ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE_MINST_4_UKER)}
                            />
                        )}
                    </VStack>
                )}
            </VStack>
        </VStack>
    );
}

const likestiltYtelseVilkårskoder: ApiVilkårskode[] = [
    ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE_MINST_4_UKER,
    ApiVilkårskode.OPPTJENING_FORELDREPENGER_IKKE_OPPTJENT_PA_AAP,
    ApiVilkårskode.OPPTJENING_YRKESAKTIV_MINST_4_UKER_FOR_UTTAK_AV_FORELDREPENGER,
];
