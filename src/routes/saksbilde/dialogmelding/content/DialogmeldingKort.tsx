import React, { ReactElement } from 'react';

import { FilePdfIcon, PaperclipIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, HStack, LinkCard, Tag, VStack } from '@navikt/ds-react';

import { useBruker } from '@auth/brukerContext';
import { ApiBehandler, ApiDialogmelding, ApiDialogmeldingAvsender } from '@io/rest/generated/sporhund.schemas';
import { useSetSelectedVedlegg } from '@saksbilde/dialogmelding/dokumentvisning/selectedVedleggAtom';
import { getFormattedDatetimeString } from '@utils/date';
import { formatNavn } from '@utils/navnUtils';

import { AvsenderInfo } from './AvsenderInfo';

interface Props {
    melding: ApiDialogmelding;
    personPseudoId: string;
    behandler: ApiBehandler;
}

export function DialogmeldingKort({ melding, personPseudoId, behandler }: Props): ReactElement {
    const setSelectedVedlegg = useSetSelectedVedlegg();
    const bruker = useBruker();
    const { color, tekst } = {
        [ApiDialogmeldingAvsender.NAV]: { color: 'meta-purple' as const, tekst: 'Nav' },
        [ApiDialogmeldingAvsender.BEHANDLER]: { color: 'info' as const, tekst: 'Behandler' },
        [ApiDialogmeldingAvsender.SYSTEM]: { color: 'warning' as const, tekst: 'Automatisk purring' },
    }[melding.avsender];

    return (
        <Box padding="space-12" borderWidth="1" borderRadius="8" borderColor="neutral-subtle">
            <VStack gap="space-8">
                <HStack justify="space-between" gap="space-8">
                    <HStack gap="space-4" align="center">
                        <Tag data-color={color} size="small" className="text-ax-large">
                            {tekst}
                        </Tag>
                        {melding.avsender === ApiDialogmeldingAvsender.BEHANDLER && melding.antallVedlegg > 0 && (
                            <HStack gap="space-2" align="center" className="text-ax-text-neutral-subtle">
                                <PaperclipIcon aria-hidden />
                                {melding.antallVedlegg}
                            </HStack>
                        )}
                    </HStack>
                    <BodyShort className="text-ax-text-neutral-subtle">
                        {getFormattedDatetimeString(melding.sendtTidspunkt)}
                    </BodyShort>
                </HStack>
                <AvsenderInfo
                    avsender={melding.avsender}
                    brukerNavn={bruker.navn}
                    behandlerNavn={formatNavn(behandler.navn)}
                />
                <BodyShort>{melding.melding}</BodyShort>
                {melding.antallVedlegg > 0 && (
                    <VStack as="ul" gap="space-4">
                        {Array.from({ length: melding.antallVedlegg }, (_, index) => {
                            const url = `/api/sporhund/personer/${personPseudoId}/vedlegg/${melding.msgId}/${index}`;
                            const label = `Vedlegg ${index + 1}`;
                            return (
                                <li key={index}>
                                    <LinkCard size="small" arrow={false}>
                                        <LinkCard.Icon>
                                            <FilePdfIcon aria-hidden fontSize="1.5rem" className="shrink-0" />
                                        </LinkCard.Icon>
                                        <LinkCard.Title>
                                            <LinkCard.Anchor
                                                href={url}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSelectedVedlegg({ url, label });
                                                }}
                                            >
                                                {label}
                                            </LinkCard.Anchor>
                                        </LinkCard.Title>
                                    </LinkCard>
                                </li>
                            );
                        })}
                    </VStack>
                )}
            </VStack>
        </Box>
    );
}
