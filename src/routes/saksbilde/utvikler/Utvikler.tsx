import React from 'react';

import { BodyShort, Box, Heading, Loader, VStack } from '@navikt/ds-react';

import { useSpleisVedtaksperiodeQuery } from '@io/rest/spleis';
import { JsonVisning } from '@saksbilde/utvikler/JsonVisning';
import { PåminnVedtaksperiode } from '@saksbilde/utvikler/PåminnVedtaksperiode';

interface UtviklerProps {
    vedtaksperiodeId: string;
    fødselsnummer: string;
}

export const Utvikler = ({ vedtaksperiodeId, fødselsnummer }: UtviklerProps) => {
    const { data, isPending, error } = useSpleisVedtaksperiodeQuery(vedtaksperiodeId, fødselsnummer);

    return (
        <Box padding="space-16">
            {isPending ? (
                <Loader size="medium" title="Henter data fra Spleis" />
            ) : error ? (
                <BodyShort>Kunne ikke hente data fra Spleis: {error.message}</BodyShort>
            ) : (
                <VStack gap="space-32">
                    <PåminnVedtaksperiode vedtaksperiode={data} fødselsnummer={fødselsnummer} />
                    <VStack gap="space-8">
                        <Heading level="2" size="small">
                            Data fra Spleis
                        </Heading>
                        <JsonVisning data={data} />
                    </VStack>
                </VStack>
            )}
        </Box>
    );
};
