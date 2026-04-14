import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { BodyShort, Button, HStack, InfoCard } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { useGetVeilederStans } from '@io/rest/generated/personer/personer';
import { useFetchPersonQuery } from '@state/person';

import { UnntattFraAutomatisering } from './UnntattFraAutomatisering';

function InfovarselOmVeilederStansContainer(): ReactElement | null {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data, loading } = useFetchPersonQuery();
    const { data: veilederStans, isLoading, error, refetch } = useGetVeilederStans(personPseudoId);

    const currentPerson = data?.person;
    if (loading || isLoading || currentPerson == null) {
        return null;
    }

    if (error) {
        return (
            <InfoCard data-color="danger" className="rounded-none">
                <InfoCard.Header>
                    <HStack gap="space-8" wrap={false} className="p-1">
                        <BodyShort>Kunne ikke hente veilederstans.</BodyShort>
                        <Button size="xsmall" onClick={() => refetch()}>
                            Prøv igjen
                        </Button>
                    </HStack>
                </InfoCard.Header>
            </InfoCard>
        );
    }

    if (veilederStans?.erStanset) {
        return (
            <UnntattFraAutomatisering
                årsaker={veilederStans.årsaker}
                tidspunkt={veilederStans.tidspunkt!}
                fødselsnummer={currentPerson.fodselsnummer}
            />
        );
    }

    return null;
}

export function InfovarselOmVeilederStans(): ReactElement {
    return (
        <ErrorBoundary
            fallback={
                <BodyShort className="bg-ax-bg-danger-soft p-2">
                    Det oppstod en feil. Kan ikke vise personinformasjon.
                </BodyShort>
            }
        >
            <InfovarselOmVeilederStansContainer />
        </ErrorBoundary>
    );
}
