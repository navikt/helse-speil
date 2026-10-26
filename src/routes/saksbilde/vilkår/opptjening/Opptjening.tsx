import React, { ReactElement, useId } from 'react';

import { HStack, Heading, Loader, Skeleton, VStack } from '@navikt/ds-react';

import { ErrorMessageWithRefetch } from '@components/ErrorMessageWithRefetch';
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
import { erLikestiltYtelse } from './likestiltYtelse';
import { Opptjeningsendring } from './useOpptjeningshistorikk';
import { Opptjeningsvurdering } from './useOpptjeningsvurdering';

interface OpptjeningProps {
    personPseudoId: string;
    opptjeningsvurdering: Opptjeningsvurdering;
    endringer: Opptjeningsendring[];
    readOnly: boolean;
    serPåTidligereBehandling: boolean;
    aktivtVilkår: ManueltVurderbarVilkårskode | null;
    onVurder: (vilkårskode: ManueltVurderbarVilkårskode) => void;
}

export function Opptjening({
    personPseudoId,
    opptjeningsvurdering,
    endringer,
    readOnly,
    serPåTidligereBehandling,
    aktivtVilkår,
    onVurder,
}: OpptjeningProps): ReactElement {
    const { data, isLoading, isError, utfall, vurderingFor, avgjørendeVilkårskode } = opptjeningsvurdering;
    const tittelId = useId();
    const erCoachFagkoordinatorEllerSupersaksbehandler = useErCoachFagkoordinatorEllerSupersaksbehandler();
    const kanVurdere = !readOnly && !serPåTidligereBehandling && erCoachFagkoordinatorEllerSupersaksbehandler;
    const arbeid = ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER;
    const likestiltYtelse = ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE_MINST_4_UKER;

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
                {kanVurdere && data && (
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
                    <ErrorMessageWithRefetch
                        className="my-6 rounded-xl"
                        errorMessage="Kunne ikke hente opptjeningsvurderingen."
                        refetch={opptjeningsvurdering.refetch}
                    />
                ) : (
                    <VStack as="ul" padding="space-0" margin="space-0" marginInline="space-16 space-0">
                        <OpptjeningVilkårsrad
                            vilkårskode={arbeid}
                            vurdering={vurderingFor(arbeid)}
                            erAvgjørende={avgjørendeVilkårskode === arbeid}
                            erAktiv={aktivtVilkår === arbeid}
                            onVurder={kanVurdere ? () => onVurder(arbeid) : undefined}
                        />
                        {kanVurdereLikestilteYtelser() && (
                            <LikestiltYtelseVilkårsrad
                                vurderingFor={vurderingFor}
                                erAvgjørende={erLikestiltYtelse(avgjørendeVilkårskode)}
                                erAktiv={aktivtVilkår === likestiltYtelse}
                                onVurder={kanVurdere ? () => onVurder(likestiltYtelse) : undefined}
                            />
                        )}
                    </VStack>
                )}
            </VStack>
        </VStack>
    );
}
