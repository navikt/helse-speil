import React, { ReactElement, useEffect, useRef, useState } from 'react';

import { CheckmarkIcon, FilesIcon } from '@navikt/aksel-icons';
import { Button, Popover, VStack } from '@navikt/ds-react';

interface CopyLabelPopoverProps {
    navn: string;
    organisasjonsnummer: string;
}

type KopierbartFelt = 'navn' | 'organisasjonsnummer';

export function CopyLabelPopover({ navn, organisasjonsnummer }: CopyLabelPopoverProps): ReactElement {
    const [open, setOpen] = useState(false);
    const [kopiertFelt, setKopiertFelt] = useState<KopierbartFelt | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) setKopiertFelt(null);
    }, [open]);

    const kopier = (felt: KopierbartFelt, verdi: string) => {
        void navigator.clipboard.writeText(verdi);
        setKopiertFelt(felt);
    };

    const felter: { felt: KopierbartFelt; verdi: string; tekst: string }[] = [
        { felt: 'navn', verdi: navn, tekst: 'Kopier navn' },
        { felt: 'organisasjonsnummer', verdi: organisasjonsnummer, tekst: 'Kopier organisasjonsnummer' },
    ];

    return (
        <>
            <Button
                ref={buttonRef}
                variant="tertiary-neutral"
                size="xsmall"
                icon={<FilesIcon aria-hidden />}
                onClick={() => setOpen((prev) => !prev)}
                title="Kopier"
            />
            <Popover anchorEl={buttonRef.current} open={open} onClose={() => setOpen(false)} placement="bottom">
                <Popover.Content>
                    <VStack gap="space-4" className="w-56">
                        {felter.map(({ felt, verdi, tekst }) => (
                            <Button
                                key={felt}
                                variant="tertiary"
                                size="small"
                                className="justify-start"
                                icon={kopiertFelt === felt ? <CheckmarkIcon aria-hidden /> : undefined}
                                onClick={() => kopier(felt, verdi)}
                            >
                                {kopiertFelt === felt ? 'Kopiert!' : tekst}
                            </Button>
                        ))}
                    </VStack>
                </Popover.Content>
            </Popover>
        </>
    );
}
