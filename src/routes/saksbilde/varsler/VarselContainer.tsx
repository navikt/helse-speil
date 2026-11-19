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
        <ExpansionCard aria-label="Varsler" size="small" data-color={laster ? undefined : oppsummering.farge}>
            <ExpansionCard.Header>
                <ExpansionCard.Title as="h2" size="small">
                    Varsler ({varsler.length})
                </ExpansionCard.Title>
                <ExpansionCard.Description>
                    {laster ? <Skeleton as="span" variant="text" width="10rem" /> : oppsummeringstekst(oppsummering)}
                </ExpansionCard.Description>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
                {laster ? (
                    <VStack gap="space-8" aria-busy="true">
                        {varslerMedStatus.map(({ varsel }) => (
                            <Skeleton key={varsel.id} variant="rectangle" height={48} />
                        ))}
                    </VStack>
                ) : (
                    <div>
                        {varslerMedStatus.map(({ varsel, status }) => (
                            <VarselItem key={varsel.id} varsel={varsel} status={status} />
                        ))}
                    </div>
                )}
            </ExpansionCard.Content>
        </ExpansionCard>
    );
}
