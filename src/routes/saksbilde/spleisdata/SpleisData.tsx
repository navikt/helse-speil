import React from 'react';

import { BodyShort, Box, Loader } from '@navikt/ds-react';

import { useSpleisVedtaksperiodeQuery } from '@io/rest/spleis';

interface SpleisDataProps {
    vedtaksperiodeId: string;
    fødselsnummer: string;
}

export const SpleisData = ({ vedtaksperiodeId, fødselsnummer }: SpleisDataProps) => {
    const { data, isPending, error } = useSpleisVedtaksperiodeQuery(vedtaksperiodeId, fødselsnummer);

    return (
        <Box padding="space-16">
            {isPending ? (
                <Loader size="medium" title="Henter data fra Spleis" />
            ) : error ? (
                <BodyShort>Kunne ikke hente data fra Spleis: {error.message}</BodyShort>
            ) : (
                <pre className="text-sm">
                    <code>{JSON.stringify(data, null, 2)}</code>
                </pre>
            )}
        </Box>
    );
};
