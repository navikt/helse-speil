import cn from 'classnames';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { ChevronRightIcon, PaperclipIcon } from '@navikt/aksel-icons';
import { Bleed, BodyShort, Button, HStack, Label, VStack } from '@navikt/ds-react';

import { useGetDialogmeldinger } from '@io/rest/generated/default/default';
import { ApiDialogOppsummering } from '@io/rest/generated/sporhund.schemas';
import { getFormattedDatetimeString } from '@utils/date';

import { DialogmeldingListeSkeleton } from './DialogmeldingListeSkeleton';

export function DialogmeldingListe(): ReactElement {
    const { personPseudoId, dialogId } = useParams<{ personPseudoId: string; dialogId?: string }>();
    const { data, isPending, isError, refetch } = useGetDialogmeldinger(personPseudoId);

    if (isPending) {
        return <DialogmeldingListeSkeleton />;
    }

    if (isError || data === undefined) {
        return (
            <VStack gap="space-8" align="start">
                <BodyShort>Kunne ikke hente dialogmeldinger</BodyShort>
                <Button variant="secondary" size="small" onClick={() => refetch()}>
                    Prøv igjen
                </Button>
            </VStack>
        );
    }

    if (data.length === 0) {
        return <BodyShort>Ingen dialogmeldinger</BodyShort>;
    }

    return (
        <VStack as="ul" gap="space-24">
            {data.map((behandler) => (
                <li key={behandler.behandlernavn}>
                    <Label>Dialog med {behandler.behandlernavn}</Label>
                    <VStack as="ul">
                        {behandler.dialoger.map((dialog: ApiDialogOppsummering) => {
                            const harVedlegg = dialog.antallVedlegg > 0;
                            const erAktiv = dialog.id === dialogId;
                            return (
                                <Bleed key={dialog.id} marginInline="space-16" asChild>
                                    <li>
                                        <Link
                                            href={`/person/${personPseudoId}/dialogmelding/${dialog.id}`}
                                            className={cn(
                                                'flex w-full items-center justify-between gap-2 border-b border-b-ax-border-neutral-subtle py-2 pr-4 pl-8 text-left hover:bg-ax-bg-accent-moderate-hover',
                                                erAktiv && 'bg-ax-bg-accent-soft',
                                            )}
                                        >
                                            <VStack>
                                                <HStack align="center" gap="space-4">
                                                    <BodyShort weight="semibold">{dialog.tittel}</BodyShort>
                                                    {harVedlegg && (
                                                        <PaperclipIcon aria-label="Har vedlegg" fontSize="1rem" />
                                                    )}
                                                </HStack>
                                                <BodyShort size="small" className="text-ax-text-neutral-subtle">
                                                    {getFormattedDatetimeString(dialog.tid)}
                                                </BodyShort>
                                            </VStack>
                                            <ChevronRightIcon aria-hidden />
                                        </Link>
                                    </li>
                                </Bleed>
                            );
                        })}
                    </VStack>
                </li>
            ))}
        </VStack>
    );
}
