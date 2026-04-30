import cn from 'classnames';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { ChatIcon, ChevronRightIcon, PaperclipIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Label, VStack } from '@navikt/ds-react';

import { getFormattedDatetimeString } from '@utils/date';

import { BehandlerDialoger, Dialog } from '../types';

type Props = {
    behandlere: BehandlerDialoger[];
};

export function VenstremenyDialogmelding({ behandlere }: Props): ReactElement {
    const { personPseudoId, dialogId } = useParams<{ personPseudoId: string; dialogId?: string }>();

    return (
        <VStack
            as="section"
            gap="space-32"
            paddingInline="space-16"
            paddingBlock="space-16"
            className="w-[366px] border-r border-r-ax-border-neutral-subtle [grid-area:venstremeny]"
        >
            <Button
                as={Link}
                href={`/person/${personPseudoId}/dialogmelding/ny`}
                variant="primary"
                size="small"
                className="self-start"
                icon={<ChatIcon />}
            >
                Ny dialogmelding
            </Button>
            <ul className="flex flex-col gap-6">
                {behandlere.map((behandler) => (
                    <li key={behandler.behandlernavn}>
                        <Label size="small" className="px-2 text-(--ax-text-subtle)">
                            {behandler.behandlernavn}
                        </Label>
                        <ul className="flex flex-col">
                            {behandler.dialoger.map((dialog: Dialog) => {
                                const harVedlegg = dialog.dialogmeldinger.some((m) => m.vedlegg.length > 0);
                                const erAktiv = dialog.id === dialogId;
                                return (
                                    <li key={dialog.id}>
                                        <Link
                                            href={`/person/${personPseudoId}/dialogmelding/${dialog.id}`}
                                            className={cn(
                                                'flex w-full items-center justify-between gap-2 rounded px-2 py-2 text-left no-underline hover:bg-(--ax-bg-neutral-moderate-hover)',
                                                erAktiv && 'bg-(--ax-bg-neutral-moderate) font-semibold',
                                            )}
                                        >
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1">
                                                    <BodyShort size="small" weight="semibold">
                                                        {dialog.tittel}
                                                    </BodyShort>
                                                    {harVedlegg && (
                                                        <PaperclipIcon
                                                            aria-label="Har vedlegg"
                                                            className="shrink-0 text-(--ax-text-subtle)"
                                                            fontSize="1rem"
                                                        />
                                                    )}
                                                </div>
                                                <BodyShort size="small" className="text-(--ax-text-subtle)">
                                                    {getFormattedDatetimeString(dialog.tid)}
                                                </BodyShort>
                                            </div>
                                            <ChevronRightIcon aria-hidden className="shrink-0" />
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </li>
                ))}
            </ul>
        </VStack>
    );
}
