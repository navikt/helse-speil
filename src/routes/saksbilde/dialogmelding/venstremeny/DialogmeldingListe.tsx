import cn from 'classnames';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { PaperclipIcon } from '@navikt/aksel-icons';
import { Bleed, BodyShort, HStack, Tag, type TagProps, VStack } from '@navikt/ds-react';

import { fagomradeLabels, statusLabels } from '@/form-schemas/nyDialogmeldingSkjema';
import { ErrorMessageWithRefetch } from '@components/ErrorMessageWithRefetch';
import { useGetDialogmeldinger } from '@io/rest/generated/default/default';
import { ApiDialogmeldingStatus } from '@io/rest/generated/sporhund.schemas';
import { getFormattedDatetimeString } from '@utils/date';
import { formatNavn } from '@utils/navnUtils';

import { DialogmeldingListeSkeleton } from './DialogmeldingListeSkeleton';

export function DialogmeldingListe(): ReactElement {
    const { personPseudoId, dialogId } = useParams<{ personPseudoId: string; dialogId?: string }>();
    const { data, isPending, isError, refetch } = useGetDialogmeldinger(personPseudoId);

    if (isPending) {
        return <DialogmeldingListeSkeleton />;
    }

    if (isError || data === undefined) {
        return <ErrorMessageWithRefetch errorMessage="Kunne ikke hente dialogmeldinger." refetch={refetch} />;
    }

    if (data.length === 0) {
        return <BodyShort>Ingen dialogmeldinger.</BodyShort>;
    }

    const sortert = [...data].sort((a, b) => b.sisteAktivitetTidspunkt.localeCompare(a.sisteAktivitetTidspunkt));

    return (
        <VStack as="ul">
            {sortert.map((dialog, index) => {
                const harVedlegg = dialog.antallVedlegg > 0;
                const erAktiv = dialog.conversationRef === dialogId;
                return (
                    <Bleed key={dialog.conversationRef} marginInline="space-16" asChild>
                        <li>
                            <Link
                                href={`/person/${personPseudoId}/dialogmelding/${dialog.conversationRef}`}
                                className={cn(
                                    'flex w-full items-center justify-between gap-2 border-b border-b-ax-border-neutral-subtle px-6 py-2 text-left hover:bg-ax-bg-accent-moderate-hover',
                                    index === 0 && 'border-t border-t-ax-border-neutral-subtle',
                                    erAktiv &&
                                        'bg-ax-bg-accent-soft shadow-[inset_5px_0_0_0] shadow-ax-border-accent-strong',
                                )}
                            >
                                <VStack>
                                    <Tag
                                        size="small"
                                        data-color={statusTagColor[dialog.status]}
                                        className="mb-2 self-start text-ax-large"
                                    >
                                        {statusLabels[dialog.status]}
                                    </Tag>
                                    <HStack align="center" gap="space-4" marginBlock="space-0 space-2">
                                        <BodyShort weight={erAktiv ? 'semibold' : 'regular'}>
                                            {fagomradeLabels[dialog.fagomrade]}
                                        </BodyShort>
                                        {harVedlegg && <PaperclipIcon aria-label="Har vedlegg" fontSize="1rem" />}
                                    </HStack>
                                    <BodyShort size="small" className="text-ax-text-neutral-subtle">
                                        {formatNavn(dialog.behandler.navn)}
                                        {dialog.behandler.legekontor.kontor &&
                                            `, ${dialog.behandler.legekontor.kontor}`}
                                    </BodyShort>
                                    <BodyShort size="small" className="text-ax-text-neutral-subtle">
                                        {getFormattedDatetimeString(dialog.sisteAktivitetTidspunkt)}
                                    </BodyShort>
                                </VStack>
                            </Link>
                        </li>
                    </Bleed>
                );
            })}
        </VStack>
    );
}

const statusTagColor: Record<ApiDialogmeldingStatus, TagProps['data-color']> = {
    [ApiDialogmeldingStatus.FERDIGSTILT]: 'success',
    [ApiDialogmeldingStatus.SENDT]: 'neutral',
    [ApiDialogmeldingStatus.PURRING_SENDT]: 'neutral',
    [ApiDialogmeldingStatus.MOTTATT]: 'neutral',
    [ApiDialogmeldingStatus.AVVIST]: 'danger',
};
