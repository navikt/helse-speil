import React, { ReactElement } from 'react';

import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack } from '@navikt/ds-react';

import type { ErrorType } from '@app/axios/orval-mutator';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { useGetForsikringForPerson } from '@io/rest/generated/forsikringer/forsikringer';
import type { ApiHttpProblemDetailsApiForsikringErrorCode } from '@io/rest/generated/spesialist.schemas';
import { BackendFeil } from '@saksbilde/venstremeny/utbetaling/UtbetalingModal';

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
                </HStack>
                <BodyShort>{somBackendfeil(error).message}</BodyShort>
            </>
        );
    }

    return (
        <BodyShort>
            {data?.eksisterer
                ? `${data.forsikringInnhold?.dekningsgrad} % fra ${data.forsikringInnhold?.gjelderFraDag}. dag`
                : forsikringHardkodet}
        </BodyShort>
    );
};

const somBackendfeil = (error: ErrorType<ApiHttpProblemDetailsApiForsikringErrorCode>): BackendFeil => {
    const problemDetailsCode = error.response?.data?.code;
    if (!problemDetailsCode)
        return {
            message: 'Feil under visning av forsikring. Kontakt utviklerteamet.',
        };

    switch (problemDetailsCode) {
        case 'MANGLER_TILGANG_TIL_PERSON':
            return message('Du har ikke tilgang til å å se forsikring for denne personen');
        case 'FEIL_VED_VIDERE_KALL':
            return message('Feil fra forsikringstjeneste');
        case 'BEHANDLING_IKKE_FUNNET':
            return message('Feil fra forsikringstjeneste');
    }
};

const message = (message: string) => ({
    message: message,
});
