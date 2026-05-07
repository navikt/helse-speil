import React, { ReactElement } from 'react';

import { FilePdfIcon, PaperclipIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, HStack, Tag, VStack } from '@navikt/ds-react';

import { ApiDialogmelding } from '@io/rest/generated/sporhund.schemas';
import { getFormattedDatetimeString } from '@utils/date';

export function DialogmeldingKort({ melding }: { melding: ApiDialogmelding }): ReactElement {
    return (
        <Box padding="space-12" borderWidth="1" borderRadius="8" borderColor="neutral-subtle">
            <VStack gap="space-8">
                <HStack justify="space-between" gap="space-8">
                    <HStack gap="space-4" align="center">
                        <Tag data-color={melding.fraNav ? 'meta-purple' : 'info'} size="small">
                            {melding.fraNav ? 'Fra Nav' : 'Fra behandler'}
                        </Tag>
                        {!melding.fraNav && melding.vedlegg.length > 0 && (
                            <HStack gap="space-2" align="center" className="text-sm text-(--ax-text-subtle)">
                                <PaperclipIcon aria-hidden />
                                {melding.vedlegg.length}
                            </HStack>
                        )}
                    </HStack>
                    <BodyShort size="small" className="shrink-0 text-(--ax-text-action)">
                        {getFormattedDatetimeString(melding.tid)}
                    </BodyShort>
                </HStack>
                <BodyShort size="small">{melding.melding}</BodyShort>
                {melding.vedlegg.length > 0 && (
                    <VStack as="ul" gap="space-4">
                        {melding.vedlegg.map((vedlegg, index) => (
                            <Box key={index} as="li" borderWidth="1" borderRadius="8" borderColor="neutral-subtle">
                                <Box
                                    as="a"
                                    href={vedlegg.url}
                                    paddingBlock="space-4"
                                    paddingInline="space-8"
                                    className="flex items-center gap-2 text-sm text-(--ax-text-default)! [text-decoration:none]! hover:[text-decoration:underline]!"
                                >
                                    <FilePdfIcon aria-hidden className="shrink-0 text-(--ax-text-subtle)" />
                                    {vedlegg.navn}
                                </Box>
                            </Box>
                        ))}
                    </VStack>
                )}
            </VStack>
        </Box>
    );
}
