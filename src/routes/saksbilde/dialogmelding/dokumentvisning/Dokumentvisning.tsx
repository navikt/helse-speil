'use client';

import React, { ReactElement, useEffect, useState } from 'react';

import { ExternalLinkIcon, FileTextIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading, Link, VStack } from '@navikt/ds-react';

import { JusterbarSidemeny } from '@components/justerbarSidemeny/JusterbarSidemeny';
import { XKnapp } from '@saksbilde/historikk/XKnapp';

import { useSelectedVedlegg, useSetSelectedVedlegg } from './selectedVedleggAtom';

export function Dokumentvisning(): ReactElement {
    const selected = useSelectedVedlegg();
    const setSelectedVedlegg = useSetSelectedVedlegg();
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const onMouseUp = () => setIsDragging(false);
        const onMouseDown = () => setIsDragging(true);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    return (
        <JusterbarSidemeny defaultBredde={800} visSidemeny={true} localStorageNavn="dokumentvisningBredde">
            <VStack as="section" className="h-full border-l border-l-ax-border-neutral-subtle">
                <div className="flex items-center justify-between border-b border-b-ax-border-neutral-subtle p-4">
                    <Heading level="3" size="xsmall">
                        Dokumentvisning
                    </Heading>
                    <div className="flex items-center gap-2">
                        {selected && (
                            <Link href={selected.url} target="_blank" rel="noreferrer">
                                <ExternalLinkIcon aria-hidden />
                                Åpne i ny fane
                            </Link>
                        )}
                        {selected && <XKnapp tittel="Lukk dokument" onClick={() => setSelectedVedlegg(null)} />}
                    </div>
                </div>
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
        </JusterbarSidemeny>
    );
}
