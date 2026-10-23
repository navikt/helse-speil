import React from 'react';

import { BodyShort, Box, Loader, Tabs } from '@navikt/ds-react';

import { useSpleisVedtaksperiodeQuery } from '@io/rest/spleis';
import { Handlinger } from '@saksbilde/utvikler/Handlinger';
import { JsonVisning } from '@saksbilde/utvikler/JsonVisning';
import { Hendelser } from '@saksbilde/utvikler/hendelser/Hendelser';

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
                <Tabs defaultValue="spleisdata" size="small">
                    <Tabs.List>
                        <Tabs.Tab value="spleisdata" label="Spleis-data" />
                        <Tabs.Tab value="hendelser" label="Hendelser" />
                        <Tabs.Tab value="handlinger" label="Handlinger" />
                    </Tabs.List>
                    <Tabs.Panel value="spleisdata">
                        <Box paddingBlock="space-16">
                            <JsonVisning data={data} />
                        </Box>
                    </Tabs.Panel>
                    <Tabs.Panel value="hendelser">
                        <Box paddingBlock="space-16">
                            <Hendelser vedtaksperiodeId={vedtaksperiodeId} fødselsnummer={fødselsnummer} />
                        </Box>
                    </Tabs.Panel>
                    <Tabs.Panel value="handlinger">
                        <Box paddingBlock="space-16">
                            <Handlinger vedtaksperiode={data} fødselsnummer={fødselsnummer} />
                        </Box>
                    </Tabs.Panel>
                </Tabs>
            )}
        </Box>
    );
};
