'use client';

import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { BodyShort, Box, HStack, Heading, VStack } from '@navikt/ds-react';

import { fagomradeLabels } from '@/form-schemas/nyDialogmeldingSkjema';
import { useGetDialogmelding } from '@io/rest/generated/default/default';
import { ApiDialogmeldingStatus } from '@io/rest/generated/sporhund.schemas';
import { behandlerKategoriLabels, formatLegekontorAdresse } from '@utils/behandlerUtils';
import { formatNavn } from '@utils/navnUtils';

import { DialogFerdigstiltSwitch } from './DialogFerdigstiltSwitch';
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

    const { behandler, dialogmeldinger, status } = data;
    const firstMelding = dialogmeldinger[0]!;
    const adresse = formatLegekontorAdresse(behandler.legekontor);
    const sortert = dialogmeldinger.sort((a, b) => b.sendtTidspunkt.localeCompare(a.sendtTidspunkt));

    return (
        <Box as="section" padding="space-16" paddingBlock="space-24 space-16" className="min-w-0 [grid-area:content]">
            <VStack gap="space-16">
                <VStack gap="space-8">
                    <Heading level="2" size="medium">
                        {fagomradeLabels[firstMelding.fagomrade]}
                    </Heading>
                    <HStack gap="space-24" wrap>
                        <BodyShort size="small">
                            {formatNavn(behandler.navn) || '-'}, {behandlerKategoriLabels[behandler.kategori] || '-'}
                        </BodyShort>
                        <BodyShort size="small">
                            {behandler.legekontor.kontor || '-'}
                            {adresse && `, ${adresse}`}
                        </BodyShort>
                        <BodyShort size="small">Org.nr.: {behandler.legekontor.orgnummer || '-'}</BodyShort>
                        <BodyShort size="small">Tlf: {behandler.telefonnummer || '-'}</BodyShort>
                    </HStack>
                    <DialogFerdigstiltSwitch
                        personPseudoId={personPseudoId}
                        dialogId={dialogId}
                        initialFerdigstilt={status === ApiDialogmeldingStatus.FERDIGSTILT}
                    />
                </VStack>
                <VStack gap="space-24">
                    {sortert.map((melding, index) => (
                        <DialogmeldingKort
                            key={index}
                            melding={melding}
                            personPseudoId={personPseudoId}
                            behandler={behandler}
                        />
                    ))}
                </VStack>
                {status !== ApiDialogmeldingStatus.FERDIGSTILT && <SvarPåDialogForm />}
            </VStack>
        </Box>
    );
}
