import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { BodyShort, Skeleton, Tooltip } from '@navikt/ds-react';

import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { useGetBehandlendeEnhetForPerson } from '@io/rest/generated/person/person';
import { useNyBehandlendeEnhet } from '@state/toggles';

import { enhetsnavn } from './enheter';

interface BehandlendeEnhetProps {
    enhetId: string;
}

export const BehandlendeEnhet = ({ enhetId }: BehandlendeEnhetProps): ReactElement => {
    const nyBehandlendeEnhetToggle = useNyBehandlendeEnhet();

    if (nyBehandlendeEnhetToggle) {
        return <BehandlendeEnhetFraApi />;
    }

    return (
        <AnonymizableText>
            Boenhet: {enhetId} ({enhetsnavn.get(Number(enhetId))})
        </AnonymizableText>
    );
};

const BehandlendeEnhetFraApi = (): ReactElement => {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data: enhet, isLoading, isError } = useGetBehandlendeEnhetForPerson(personPseudoId);

    if (isLoading) {
        return (
            <Tooltip content="Henter behandlende enhet...">
                <Skeleton variant="rectangle" width="8rem" />
            </Tooltip>
        );
    }

    if (isError || !enhet) {
        return <BodyShort className="text-red-600">Ukjent enhet</BodyShort>;
    }

    return (
        <AnonymizableText>
            {enhet.enhetNr} - {enhet.navn}
        </AnonymizableText>
    );
};
