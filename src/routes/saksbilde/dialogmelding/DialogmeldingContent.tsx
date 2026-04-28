'use client';

import { useAtomValue } from 'jotai';
import React, { ReactElement, useState } from 'react';

import { FilePdfIcon, PaperclipIcon, PaperplaneIcon } from '@navikt/aksel-icons';
import {
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

import { Dialogmelding, valgtDialogAtom } from './types';

function formaterDatoTid(dato: Date): string {
    return (
        dato.toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit', year: '2-digit' }) +
        ' kl. ' +
        dato.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })
    );
}

function DialogmeldingKort({ melding }: { melding: Dialogmelding }): ReactElement {
    return (
        <Box padding="space-12" borderWidth="1" borderRadius="8" borderColor="neutral-subtle">
            <VStack gap="space-8">
                <HStack justify="space-between" gap="space-8">
                    <HStack gap="space-4" align="center">
                        <Tag variant={melding.fraNav ? 'alt3' : 'neutral'} size="small">
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
                        {formaterDatoTid(melding.tid)}
                    </BodyShort>
                </HStack>
                <BodyShort size="small">{melding.innehold}</BodyShort>
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
        <Box paddingBlock="space-12 space-0" borderWidth="1 0 0 0" borderColor="neutral-subtle">
            <VStack gap="space-8">
                <Heading size="small">Svar på melding</Heading>
                <Textarea
                    label="Send melding til behandler"
                    value={melding}
                    onChange={(e) => setMelding(e.target.value)}
                    minRows={3}
                />
                <CheckboxGroup legend="Takst" value={takst} onChange={setTakst}>
                    <Checkbox value="L-8">L-8</Checkbox>
                    <Checkbox value="L-40">L-40</Checkbox>
                </CheckboxGroup>
                <VStack gap="space-4">
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
    );
}

export function DialogmeldingContent(): ReactElement {
    const valgtDialog = useAtomValue(valgtDialogAtom);

    if (!valgtDialog) {
        return (
            <Box as="section" padding="space-16">
                <BodyShort className="text-(--ax-text-subtle)">Velg en dialog i menyen til venstre.</BodyShort>
            </Box>
        );
    }

    return (
        <Box as="section" padding="space-16">
            <VStack gap="space-12">
                <VStack gap="space-2">
                    <Heading size="medium">Dialogmelding</Heading>
                    <Heading size="small">{valgtDialog.tittel}</Heading>
                </VStack>
                <VStack gap="space-8">
                    {valgtDialog.dialogmeldinger.map((melding, index) => (
                        <DialogmeldingKort key={index} melding={melding} />
                    ))}
                </VStack>
                <SvarPåMelding />
            </VStack>
        </Box>
    );
}
