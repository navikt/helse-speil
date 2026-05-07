'use client';

import React, { ReactElement, useState } from 'react';

import { FilePdfIcon, PaperclipIcon, PaperplaneIcon } from '@navikt/aksel-icons';
import {
    Bleed,
    BodyShort,
    Box,
    Button,
    Checkbox,
    CheckboxGroup,
    HStack,
    Heading,
    Tag,
    Textarea,
    VStack,
} from '@navikt/ds-react';

import { ApiDialog, ApiDialogmelding } from '@io/rest/generated/sporhund.schemas';
import { getFormattedDatetimeString } from '@utils/date';

function DialogmeldingKort({ melding }: { melding: ApiDialogmelding }): ReactElement {
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

function SvarPåMelding(): ReactElement {
    const [melding, setMelding] = useState('');
    const [takst, setTakst] = useState<string[]>([]);

    const handleSend = () => {
        console.log('Sender svar:', { melding, takst });
        setMelding('');
        setTakst([]);
    };

    return (
        <Bleed marginInline="space-16" marginBlock="space-0 space-16" reflectivePadding asChild>
            <Box borderWidth="1 0 0 0" borderColor="neutral-subtle" background="neutral-soft">
                <VStack gap="space-16" className="pt-4">
                    <Heading size="small">Svar på melding</Heading>
                    <Textarea
                        label="Send melding til behandler"
                        value={melding}
                        onChange={(e) => setMelding(e.target.value)}
                        minRows={4}
                        className="max-w-250"
                    />
                    <CheckboxGroup legend="Takst" value={takst} onChange={setTakst}>
                        <Checkbox value="L-8">L-8</Checkbox>
                        <Checkbox value="L-40">L-40</Checkbox>
                    </CheckboxGroup>
                    <VStack gap="space-8" className="mb-3">
                        <Heading size="xsmall">Vedlegg</Heading>
                        <Button
                            variant="secondary"
                            size="small"
                            icon={<PaperclipIcon aria-hidden />}
                            className="self-start"
                        >
                            Legg til vedlegg
                        </Button>
                    </VStack>
                    <Button
                        variant="primary"
                        size="small"
                        icon={<PaperplaneIcon aria-hidden />}
                        onClick={handleSend}
                        className="self-start"
                    >
                        Send svar
                    </Button>
                </VStack>
            </Box>
        </Bleed>
    );
}

interface DialogmeldingContentProps {
    dialog: ApiDialog;
}

export function DialogmeldingContent({ dialog }: DialogmeldingContentProps): ReactElement {
    return (
        <Box as="section" padding="space-16" className="[grid-area:content]">
            <VStack gap="space-16">
                <VStack gap="space-8">
                    <Heading level="2" size="medium">
                        Dialogmelding
                    </Heading>
                    <Heading level="3" size="xsmall">
                        {dialog.tittel}
                    </Heading>
                </VStack>
                <VStack gap="space-16">
                    {dialog.dialogmeldinger.map((melding, index) => (
                        <DialogmeldingKort key={index} melding={melding} />
                    ))}
                </VStack>
                <SvarPåMelding />
            </VStack>
        </Box>
    );
}
