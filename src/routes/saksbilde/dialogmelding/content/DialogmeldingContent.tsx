'use client';

import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { BodyShort, Box, HStack, Heading, VStack } from '@navikt/ds-react';

import { useGetDialogmelding } from '@io/rest/generated/default/default';

import { behandlerKategoriLabels, formatBehandlerNavn } from '../formatBehandlerNavn';
import { DialogmeldingContentError } from './DialogmeldingContentError';
import { DialogmeldingContentSkeleton } from './DialogmeldingContentSkeleton';
import { DialogmeldingKort } from './DialogmeldingKort';
import { SvarPåDialogForm } from './SvarPåDialogForm';

export function DialogmeldingContent(): ReactElement {
    const { personPseudoId, dialogId } = useParams<{ personPseudoId: string; dialogId: string }>();
    const { data, isPending, isError, refetch } = useGetDialogmelding(personPseudoId, dialogId, {
        query: { gcTime: 2 * 60 * 1000 },
    });

    if (isPending) {
        return <DialogmeldingContentSkeleton />;
    }

    if (isError || data === undefined) {
        return <DialogmeldingContentError refetch={refetch} />;
    }

    return (
        <Box as="section" padding="space-16" className="[grid-area:content]">
            <VStack gap="space-16">
                <VStack gap="space-8">
                    <Heading level="2" size="medium">
                        {data.tittel}
                    </Heading>
                    <HStack gap="space-16" wrap>
                        <BodyShort size="small">
                            <span className="font-semibold text-ax-text-neutral-subtle">Behandler:</span>{' '}
                            {formatBehandlerNavn(data.behandler.navn) || '-'}
                        </BodyShort>
                        <BodyShort size="small">
                            <span className="font-semibold text-ax-text-neutral-subtle">Kategori:</span>{' '}
                            {behandlerKategoriLabels[data.behandler.kategori] || '-'}
                        </BodyShort>
                        <BodyShort size="small">
                            <span className="font-semibold text-ax-text-neutral-subtle">Telefon:</span>{' '}
                            {data.behandler.telefonnummer || '-'}
                        </BodyShort>
                        <BodyShort size="small">
                            <span className="font-semibold text-ax-text-neutral-subtle">Kontor:</span>{' '}
                            {data.behandler.legekontor.kontor || '-'}
                            {(() => {
                                const adresse = [
                                    data.behandler.legekontor.adresse,
                                    data.behandler.legekontor.postnummer,
                                    data.behandler.legekontor.poststed,
                                ]
                                    .filter(Boolean)
                                    .join(', ');
                                return adresse ? ` (${adresse})` : '';
                            })()}
                        </BodyShort>
                        <BodyShort size="small">
                            <span className="font-semibold text-ax-text-neutral-subtle">Organisasjonsnummer:</span>{' '}
                            {data.behandler.legekontor.orgnummer || '-'}
                        </BodyShort>
                    </HStack>
                </VStack>
                <VStack gap="space-16">
                    {data.dialogmeldinger.map((melding, index) => (
                        <DialogmeldingKort key={index} melding={melding} />
                    ))}
                </VStack>
                <SvarPåDialogForm />
            </VStack>
        </Box>
    );
}
