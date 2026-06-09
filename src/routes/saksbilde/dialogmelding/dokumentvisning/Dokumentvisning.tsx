'use client';

import React, { ReactElement } from 'react';

import { ExternalLinkIcon, FileTextIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, Heading, Link, VStack } from '@navikt/ds-react';

import { JusterbarSidemeny } from '@components/justerbarSidemeny/JusterbarSidemeny';
import { useErJusterbarSidemenyDragging } from '@components/justerbarSidemeny/JusterbarSidemenyContext';
import { XKnapp } from '@saksbilde/historikk/XKnapp';

import { useSelectedVedlegg, useSetSelectedVedlegg } from './selectedVedleggAtom';

export function Dokumentvisning(): ReactElement {
    return (
        <JusterbarSidemeny defaultBredde={800} visSidemeny={true} localStorageNavn="dokumentvisningBredde">
            <DokumentInnhold />
        </JusterbarSidemeny>
    );
}

function DokumentInnhold(): ReactElement {
    const selected = useSelectedVedlegg();
    const setSelectedVedlegg = useSetSelectedVedlegg();
    const isDragging = useErJusterbarSidemenyDragging();

    return (
        <VStack as="section" className="-ml-1.75 h-full w-[calc(100%+7px)]">
            <HStack align="center" justify="space-between" className="border-b border-b-ax-border-neutral-subtle p-4">
                <Heading level="3" size="xsmall">
                    Dokumentvisning
                </Heading>
                <HStack align="center" gap="space-8">
                    {selected && (
                        <Link href={selected.url} target="_blank" rel="noreferrer">
                            <ExternalLinkIcon aria-hidden />
                            Åpne i ny fane
                        </Link>
                    )}
                    {selected && <XKnapp tittel="Lukk dokument" onClick={() => setSelectedVedlegg(null)} />}
                </HStack>
            </HStack>
            {selected ? (
                <iframe
                    src={`${selected.url}#zoom=page-width`}
                    className="h-full w-full"
                    title={selected.label}
                    style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
                />
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
