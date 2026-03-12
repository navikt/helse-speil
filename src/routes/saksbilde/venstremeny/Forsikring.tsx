import React, { ReactElement } from 'react';

import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack } from '@navikt/ds-react';

import type { ErrorType } from '@app/axios/orval-mutator';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { useGetForsikringForPerson } from '@io/rest/generated/forsikringer/forsikringer';
import type { ApiHttpProblemDetailsApiForsikringErrorCode } from '@io/rest/generated/spesialist.schemas';

export const Forsikring = ({
    behandlingId,
    forsikringHardkodet,
}: {
    behandlingId: string;
    forsikringHardkodet: string;
}): ReactElement => {
    const { data, isLoading, error } = useGetForsikringForPerson(behandlingId);

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
                    : forsikringHardkodet}
            </BodyShort>
        </>
    );
};

export const somForsikringBackendfeil = (error: ErrorType<ApiHttpProblemDetailsApiForsikringErrorCode>): string => {
    const problemDetailsCode = error.response?.data?.code;
    if (!problemDetailsCode) return 'Feil under visning av forsikring. Kontakt utviklerteamet.';

    switch (problemDetailsCode) {
        case 'MANGLER_TILGANG_TIL_PERSON':
            return 'Du har ikke tilgang til å å se forsikring for denne personen';
        case 'FEIL_VED_VIDERE_KALL':
            return 'Feil fra forsikringstjeneste';
        case 'BEHANDLING_IKKE_FUNNET':
            return 'Feil fra forsikringstjeneste';
    }
};
