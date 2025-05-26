import React from 'react';

import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { HStack, Skeleton, Tooltip } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { useOrganisasjonQuery } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { KopierAgNavn } from '@saksbilde/timeline/KopierAgNavn';
import { useIsAnonymous } from '@state/anonymization';
import { capitalizeArbeidsgiver } from '@utils/locale';

export const Organisasjonsnavn = ({
    organisasjonsnummer,
    weight,
    showCopyButton,
}: {
    organisasjonsnummer: string;
    weight?: 'regular' | 'semibold';
    showCopyButton?: boolean;
}) => {
    const { loading, data } = useOrganisasjonQuery(organisasjonsnummer);
    const isAnonymous = useIsAnonymous();
    const navn = data?.organisasjon?.navn ? capitalizeArbeidsgiver(data.organisasjon.navn) : undefined;

    return loading ? (
        <Tooltip content="Henter navn fra enhetsregisteret...">
            <Skeleton width="8rem" />
        </Tooltip>
    ) : navn === undefined ? (
        <Tooltip content="Klarte ikke finne ikke navn på organisasjonen i enhetsregisteret">
            <HStack align="center">
                <AnonymizableTextWithEllipsis weight={weight}>{organisasjonsnummer}</AnonymizableTextWithEllipsis>
                <ExclamationmarkTriangleIcon color="red" />
            </HStack>
        </Tooltip>
    ) : (
        <Tooltip content={isAnonymous ? 'Arbeidsgiver' : navn}>
            <HStack gap="2">
                <AnonymizableTextWithEllipsis weight={weight}>{navn}</AnonymizableTextWithEllipsis>
                {showCopyButton && <KopierAgNavn navn={navn} />}
            </HStack>
        </Tooltip>
    );
};
