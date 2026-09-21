import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { BodyShort, HStack, Skeleton, Tooltip } from '@navikt/ds-react';

import { useGetBehandlendeEnhetForPerson } from '@io/rest/generated/personer/personer';

export const BehandlendeEnhet = (): ReactElement => {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data: enhet, isLoading, isError } = useGetBehandlendeEnhetForPerson(personPseudoId);

    if (isLoading) {
        return (
            <Tooltip content="Henter behandlende enhet...">
                <HStack>
                    <Skeleton variant="rectangle" width="200px" />
                </HStack>
            </Tooltip>
        );
    }

    if (isError || !enhet) {
        return <BodyShort className="text-ax-text-danger-decoration">Ukjent enhet</BodyShort>;
    }

    return (
        <BodyShort data-sensitive>
            {enhet.enhetNr} - {enhet.navn}
        </BodyShort>
    );
};
