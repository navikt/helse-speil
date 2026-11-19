import { ReactElement } from 'react';

import { ExpansionCard, Skeleton, VStack } from '@navikt/ds-react';

import { ApiVarselDTO } from '@io/rest/generated/spesialist.schemas';

import { VarselItem } from './VarselItem';
import { useVisSomFeilRegler } from './useVisSomFeilRegler';
import { finnVarselstatus, oppsummerVarsler, oppsummeringstekst, venterPåMedlemskapsstatus } from './varselstatus';

interface VarselContainerProps {
    varsler: ApiVarselDTO[];
}

export function VarselContainer({ varsler }: VarselContainerProps): ReactElement {
    const { visSomFeil, henterMedlemskapsstatus } = useVisSomFeilRegler();
    const varslerMedStatus = varsler.map((varsel) => ({ varsel, status: finnVarselstatus(varsel, visSomFeil) }));
    const oppsummering = oppsummerVarsler(varslerMedStatus.map(({ status }) => status));
    const laster = venterPåMedlemskapsstatus(varsler, visSomFeil, henterMedlemskapsstatus);

    return (
        <VStack margin="space-24">
            <ExpansionCard aria-label="Varsler" size="small" data-color={laster ? undefined : oppsummering.farge}>
                <ExpansionCard.Header className="[--ax-bg-moderate-hoverA:transparent]">
                    <ExpansionCard.Title as="h2" size="small">
                        Varsler ({varsler.length})
                    </ExpansionCard.Title>
                    <ExpansionCard.Description>
                        {laster ? (
                            <Skeleton as="span" variant="text" width="10rem" />
                        ) : (
                            oppsummeringstekst(oppsummering)
                        )}
                    </ExpansionCard.Description>
                </ExpansionCard.Header>
                <ExpansionCard.Content className="bg-ax-bg-raised">
                    {laster ? (
                        <VStack gap="space-8" aria-busy="true">
                            {varslerMedStatus.map(({ varsel }) => (
                                <Skeleton key={varsel.id} variant="rectangle" height={48} />
                            ))}
                        </VStack>
                    ) : (
                        <VStack gap="space-16">
                            {varslerMedStatus.map(({ varsel, status }) => (
                                <VarselItem key={varsel.id} varsel={varsel} status={status} />
                            ))}
                        </VStack>
                    )}
                </ExpansionCard.Content>
            </ExpansionCard>
        </VStack>
    );
}
