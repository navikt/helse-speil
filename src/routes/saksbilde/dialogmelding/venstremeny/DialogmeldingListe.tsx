import cn from 'classnames';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { ChevronRightIcon, PaperclipIcon } from '@navikt/aksel-icons';
import { Bleed, BodyShort, HStack, VStack } from '@navikt/ds-react';

import { ErrorMessageWithRefetch } from '@components/ErrorMessageWithRefetch';
import { useGetDialogmeldinger } from '@io/rest/generated/default/default';
import { ApiBehandlerNavn } from '@io/rest/generated/sporhund.schemas';
import { getFormattedDatetimeString } from '@utils/date';

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
        return <BodyShort>Ingen dialogmeldinger</BodyShort>;
    }

    return (
        <VStack as="ul">
            {data.map((dialog) => {
                const harVedlegg = dialog.antallVedlegg > 0;
                const erAktiv = dialog.id === dialogId;
                return (
                    <Bleed key={dialog.id} marginInline="space-16" asChild>
                        <li>
                            <Link
                                href={`/person/${personPseudoId}/dialogmelding/${dialog.id}`}
                                className={cn(
                                    'flex w-full items-center justify-between gap-2 border-b border-b-ax-border-neutral-subtle px-6 py-2 text-left hover:bg-ax-bg-accent-moderate-hover',
                                    erAktiv &&
                                        'bg-ax-bg-accent-soft shadow-[inset_4px_0_0_0] shadow-ax-border-accent-strong',
                                )}
                            >
                                <VStack>
                                    <HStack align="center" gap="space-4" marginBlock="space-0 space-2">
                                        <BodyShort weight={erAktiv ? 'semibold' : 'regular'}>{dialog.tittel}</BodyShort>
                                        {harVedlegg && <PaperclipIcon aria-label="Har vedlegg" fontSize="1rem" />}
                                    </HStack>
                                    <BodyShort size="small" className="text-ax-text-neutral-subtle">
                                        {formatBehandlerNavn(dialog.behandler.navn)}
                                        {dialog.behandler.legekontor.kontor &&
                                            `, ${dialog.behandler.legekontor.kontor}`}
                                    </BodyShort>
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
    );
}

function formatBehandlerNavn(navn: ApiBehandlerNavn): string {
    return [navn.fornavn, navn.mellomnavn, navn.etternavn].filter(Boolean).join(' ');
}
