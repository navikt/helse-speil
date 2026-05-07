'use client';

import React, { ReactElement, useState } from 'react';

import { PaperclipIcon, PaperplaneIcon } from '@navikt/aksel-icons';
import { Bleed, Box, Button, Checkbox, CheckboxGroup, Heading, Textarea, VStack } from '@navikt/ds-react';

export function SvarPåMelding(): ReactElement {
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
