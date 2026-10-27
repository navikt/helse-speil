import React, { ReactElement, useId } from 'react';

import { Button, HStack, Heading, Loader, Skeleton, VStack } from '@navikt/ds-react';

import { ErrorMessageWithRefetch } from '@components/ErrorMessageWithRefetch';
import { useErCoachFagkoordinatorEllerSupersaksbehandler } from '@hooks/brukerrolleHooks';
import { VilkårsutfallIkon } from '@saksbilde/vilkår/vilkårsutfall';
import { cn } from '@utils/tw';

import { EndringsloggOpptjeningButton } from './EndringsloggOpptjeningButton';
import { Opptjeningsdetaljer } from './Opptjeningsdetaljer';
import { VurderAutomatiskPåNyttKnapp } from './VurderAutomatiskPåNyttKnapp';
import { erAutomatiskOppfylt, opptjeningsvilkår } from './opptjeningsutfall';
import { Opptjeningsendring } from './useOpptjeningshistorikk';
import { Opptjeningsvurdering } from './useOpptjeningsvurdering';

interface OpptjeningProps {
    personPseudoId: string;
    opptjeningsvurdering: Opptjeningsvurdering;
    endringer: Opptjeningsendring[];
    readOnly: boolean;
    serPåTidligereBehandling: boolean;
    vurderer: boolean;
    onVurder: () => void;
}

export function Opptjening({
    personPseudoId,
    opptjeningsvurdering,
    endringer,
    readOnly,
    serPåTidligereBehandling,
    vurderer,
    onVurder,
}: OpptjeningProps): ReactElement {
    const { data, isLoading, isError, utfall, vurderingFor } = opptjeningsvurdering;
    const tittelId = useId();
    const erCoachFagkoordinatorEllerSupersaksbehandler = useErCoachFagkoordinatorEllerSupersaksbehandler();
    const kanVurdere = !readOnly && !serPåTidligereBehandling && erCoachFagkoordinatorEllerSupersaksbehandler;
    const kanVurdereManuelt = kanVurdere && data && !erAutomatiskOppfylt(opptjeningsvilkår(vurderingFor));

    return (
        <VStack
            as="section"
            aria-labelledby={tittelId}
            gap="space-16"
            className={cn('-mr-[3px] -ml-1 px-1 pt-2 pb-6', {
                // Dekker den blå kanten til vurderingspanelet, så seksjonen og skjemaet henger sammen
                'relative z-10 bg-ax-bg-accent-soft': vurderer,
            })}
        >
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
                {kanVurdereManuelt && (
                    <Button type="button" variant="secondary" size="small" onClick={onVurder} className="ml-auto">
                        Vurder vilkår
                    </Button>
                )}
            </HStack>
            <VStack className="pl-9">
                {isLoading ? (
                    <Skeleton variant="rounded" height={56} />
                ) : isError || !data ? (
                    <ErrorMessageWithRefetch
                        className="rounded-xl"
                        errorMessage="Kunne ikke hente opptjeningsvurderingen."
                        refetch={opptjeningsvurdering.refetch}
                    />
                ) : (
                    <Opptjeningsdetaljer vurderingFor={vurderingFor} />
                )}
            </VStack>
        </VStack>
    );
}
