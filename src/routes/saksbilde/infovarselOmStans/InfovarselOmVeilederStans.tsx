import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { ErrorMessageWithRefetch } from '@components/ErrorMessageWithRefetch';
import { useGetPerson, useGetVeilederStans } from '@io/rest/generated/personer/personer';

import { UnntattFraAutomatisering } from './UnntattFraAutomatisering';

function InfovarselOmVeilederStansContainer(): ReactElement | null {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data: currentPerson, isPending } = useGetPerson(personPseudoId);
    const { data: veilederStans, isLoading, error, refetch } = useGetVeilederStans(personPseudoId);

    if (isPending || isLoading || currentPerson == null) {
        return null;
    }

    if (error) {
        return <ErrorMessageWithRefetch errorMessage="Kunne ikke hente veilederstans." refetch={refetch} />;
    }

    if (veilederStans?.erStanset) {
        return (
            <UnntattFraAutomatisering
                årsaker={veilederStans.årsaker}
                tidspunkt={veilederStans.tidspunkt!}
                fødselsnummer={currentPerson.identitetsnummer}
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
