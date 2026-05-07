import cn from 'classnames';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { ChevronRightIcon, NotePencilIcon, PaperclipIcon } from '@navikt/aksel-icons';
import { Bleed, BodyShort, Button, HStack, Label, VStack } from '@navikt/ds-react';

import { useGetDialogmeldinger } from '@io/rest/generated/default/default';
import { getFormattedDatetimeString } from '@utils/date';

import { Dialog } from '../types';

export function VenstremenyDialogmelding(): ReactElement {
    const { personPseudoId, dialogId } = useParams<{ personPseudoId: string; dialogId?: string }>();
    const { data, isPending } = useGetDialogmeldinger(personPseudoId);

    if (isPending || data === undefined) {
        return <div>skeleton</div>;
    }

    return (
        <VStack
            as="section"
            gap="space-16"
            paddingInline="space-16"
            paddingBlock="space-16"
            className="w-[366px] border-r border-r-ax-border-neutral-subtle [grid-area:venstremeny]"
        >
            <Button
                as={Link}
                href={`/person/${personPseudoId}/dialogmelding/ny`}
                variant="primary"
                size="small"
                icon={<NotePencilIcon />}
            >
                Ny dialogmelding
            </Button>
            <VStack as="ul" gap="space-24">
                {data.map((behandler) => (
                    <li key={behandler.behandlernavn}>
                        <Label>{behandler.behandlernavn}</Label>
                        <VStack as="ul">
                            {behandler.dialoger.map((dialog: Dialog) => {
                                const harVedlegg = dialog.dialogmeldinger.some((m) => m.vedlegg.length > 0);
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
        </VStack>
    );
}
