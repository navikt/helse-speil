import React, { useState } from 'react';

import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Loader, Tabs } from '@navikt/ds-react';

import { erProd } from '@/env';
import { useSpleisVedtaksperiodeQuery } from '@io/rest/spleis';
import { Handlinger } from '@saksbilde/utvikler/Handlinger';
import { JsonVisning } from '@saksbilde/utvikler/JsonVisning';
import { Rettighetskategori } from '@saksbilde/utvikler/Rettighetskategori';
import { Hendelser } from '@saksbilde/utvikler/hendelser/Hendelser';

interface UtviklerProps {
    vedtaksperiodeId: string;
    fødselsnummer: string;
    personPseudoId: string;
}

export const Utvikler = ({ vedtaksperiodeId, fødselsnummer, personPseudoId }: UtviklerProps) => {
    const { data, isPending, error } = useSpleisVedtaksperiodeQuery(vedtaksperiodeId, fødselsnummer);
    const [valgtTab, setValgtTab] = useState('spleisdata');

    return (
        <Box padding="space-16">
            {isPending ? (
                <Loader size="medium" title="Henter data fra Spleis" />
            ) : error ? (
                <BodyShort>Kunne ikke hente data fra Spleis: {error.message}</BodyShort>
            ) : (
                <Tabs value={valgtTab} onChange={(value) => value !== 'sporing' && setValgtTab(value)} size="small">
                    <Tabs.List>
                        <Tabs.Tab value="spleisdata" label="Spleis-data" />
                        <Tabs.Tab value="rettighetskategori" label="Rettighetskategori" />
                        <Tabs.Tab value="hendelser" label="Hendelser" />
                        <Tabs.Tab value="handlinger" label="Handlinger" />
                        <Tabs.Tab
                            as="a"
                            value="tilstandsmaskin"
                            label="Tilstandsmaskin"
                            icon={<ExternalLinkIcon aria-hidden />}
                            href={sporingUrl(vedtaksperiodeId)}
                            target="_blank"
                            rel="noopener noreferrer"
                        />
                    </Tabs.List>
                    <Tabs.Panel value="spleisdata">
                        <Box paddingBlock="space-16">
                            <JsonVisning data={data} />
                        </Box>
                    </Tabs.Panel>
                    <Tabs.Panel value="rettighetskategori">
                        <Box paddingBlock="space-16">
                            <Rettighetskategori
                                personPseudoId={personPseudoId}
                                rettighetskategoriId={data.vilkårsgrunnlag?.rettighetskategoriId}
                            />
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

function sporingUrl(vedtaksperiodeId: string): string {
    const host = erProd ? 'sporing.ansatt.nav.no' : 'sporing.ansatt.dev.nav.no';
    return `https://${host}/tilstandsmaskin/${vedtaksperiodeId}`;
}
