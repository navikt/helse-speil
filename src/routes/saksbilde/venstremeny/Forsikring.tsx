import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { BodyShort, InlineMessage } from '@navikt/ds-react';

import { erUtvikling } from '@/env';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { useGetForsikringsvurderingForPerson } from '@io/rest/generated/forsikringer/forsikringer';

export const Forsikring = ({ forsikringsvurderingId }: { forsikringsvurderingId: string | null }): ReactElement => {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data, isLoading, error } = useGetForsikringsvurderingForPerson(personPseudoId, forsikringsvurderingId!, {
        query: {
            enabled: erUtvikling && !!forsikringsvurderingId,
        },
    });

    return (
        <>
            <BodyShort>Dekning</BodyShort>
            {isLoading ? (
                <LoadingShimmer />
            ) : error ? (
                <InlineMessage status="error">Klarte ikke hente</InlineMessage>
            ) : data?.eksisterer ? (
                <BodyShort>{`${data.forsikringInnhold?.dekningsgrad} % fra ${data.forsikringInnhold?.gjelderFraDag}. dag`}</BodyShort>
            ) : (
                <BodyShort>80 % fra 17. dag</BodyShort>
            )}
        </>
    );
};
