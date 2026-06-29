import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack } from '@navikt/ds-react';

import { erUtvikling } from '@/env';
import type { ErrorType } from '@app/axios/orval-mutator';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { useGetForsikringsvurderingForPerson } from '@io/rest/generated/forsikringer/forsikringer';
import type { ApiHttpProblemDetailsApiGetForsikringsvurderingForPersonErrorCode } from '@io/rest/generated/spesialist.schemas';

export const Forsikring = ({ forsikringsvurderingId }: { forsikringsvurderingId: string | null }): ReactElement => {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data, isLoading, error } = useGetForsikringsvurderingForPerson(personPseudoId, forsikringsvurderingId!, {
        query: {
            enabled: erUtvikling && !!forsikringsvurderingId,
        },
    });

    if (isLoading) {
        return (
            <>
                <BodyShort>Dekning</BodyShort>
                <LoadingShimmer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <HStack className="items-center gap-2">
                    <ExclamationmarkTriangleIcon
                        title="Feil"
                        aria-label="Feil"
                        className="text-ax-text-warning-decoration"
                    />
                    <BodyShort>Dekning</BodyShort>
                </HStack>
                <BodyShort>{somForsikringBackendfeil(error)}</BodyShort>
            </>
        );
    }

    return (
        <>
            <BodyShort>Dekning</BodyShort>
            <BodyShort>
                {data?.eksisterer
                    ? `${data.forsikringInnhold?.dekningsgrad} % fra ${data.forsikringInnhold?.gjelderFraDag}. dag`
                    : `80 % fra 17. dag`}
            </BodyShort>
        </>
    );
};

export const somForsikringBackendfeil = (
    error: ErrorType<ApiHttpProblemDetailsApiGetForsikringsvurderingForPersonErrorCode>,
): string => {
    const problemDetailsCode = error.response?.data?.code;
    if (!problemDetailsCode) return 'Feil under visning av forsikring. Kontakt utviklerteamet.';

    switch (problemDetailsCode) {
        case 'MANGLER_TILGANG_TIL_PERSON':
            return 'Du har ikke tilgang til å å se forsikring for denne personen';
        case 'FEIL_VED_VIDERE_KALL':
        case 'PERSON_PSEUDO_ID_IKKE_FUNNET':
        case 'FORSIKRINGSVURDERING_IKKE_FUNNET':
            return 'Feil ved henting av forsikring';
    }
};
