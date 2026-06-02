'use client';

import React, { ReactElement } from 'react';

import { ExternalLinkIcon, FileTextIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading, Link, VStack } from '@navikt/ds-react';

import { useSelectedVedlegg } from './selectedVedleggAtom';

export function Dokumentvisning(): ReactElement {
    const selected = useSelectedVedlegg();

    return (
        <VStack
            as="section"
            gap="space-8"
            className="w-300 border-l border-l-ax-border-neutral-subtle [grid-area:høyremeny]"
        >
            <div className="flex items-center justify-between border-b border-b-ax-border-neutral-subtle p-4">
                <Heading level="3" size="xsmall">
                    Dokumentvisning
                </Heading>
                {selected && (
                    <Link href={selected.url} target="_blank" rel="noreferrer">
                        <ExternalLinkIcon aria-hidden />
                        Åpne i ny fane
                    </Link>
                )}
            </div>
            {selected ? (
                <iframe src={selected.url} className="h-full w-full" title={selected.label} />
            ) : (
                <VStack align="center" padding="space-16" className="mt-20 text-center">
                    <FileTextIcon fontSize={62} className="text-ax-text-neutral-subtle" />
                    <BodyShort weight="semibold">Ingen dokument valgt</BodyShort>
                    <BodyShort size="small" className="text-ax-text-neutral-subtle">
                        Klikk på et dokument i meldingstråden for å se forhåndsvisning
                    </BodyShort>
                </VStack>
            )}
        </VStack>
    );
}
