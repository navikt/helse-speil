'use client';

import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { BodyShort, Box, HStack, Heading, VStack } from '@navikt/ds-react';

import { useGetDialogmelding } from '@io/rest/generated/default/default';
import { behandlerKategoriLabels, formatBehandlerNavn, formatLegekontorAdresse } from '@utils/behandlerUtils';

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

    const { behandler, dialogmeldinger } = data;
    const adresse = formatLegekontorAdresse(behandler.legekontor);
    const sortert = dialogmeldinger.sort((a, b) => b.tid.localeCompare(a.tid));

    return (
        <Box as="section" padding="space-16" className="[grid-area:content]">
            <VStack gap="space-16">
                <VStack gap="space-8">
                    <Heading level="2" size="medium">
                        {data.tittel}
                    </Heading>
                    <HStack gap="space-24" wrap>
                        <BodyShort size="small">
                            {formatBehandlerNavn(behandler.navn) || '-'},{' '}
                            {behandlerKategoriLabels[behandler.kategori] || '-'}
                        </BodyShort>
                        <BodyShort size="small">
                            {behandler.legekontor.kontor || '-'}
                            {adresse && `, ${adresse}`}
                        </BodyShort>
                        <BodyShort size="small">Org.nr.: {behandler.legekontor.orgnummer || '-'}</BodyShort>
                        <BodyShort size="small">Tlf: {behandler.telefonnummer || '-'}</BodyShort>
                    </HStack>
                </VStack>
                <VStack gap="space-16">
                    {sortert.map((melding, index) => (
                        <DialogmeldingKort key={index} melding={melding} />
                    ))}
                </VStack>
                <SvarPåDialogForm />
            </VStack>
        </Box>
    );
}
