import NextLink from 'next/link';
import React, { ReactElement } from 'react';

import { BodyShort, Button, Dialog } from '@navikt/ds-react';

interface TimeoutDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TimeoutDialog({ open, onOpenChange }: TimeoutDialogProps): ReactElement {
    return (
        <Dialog open={open} onOpenChange={onOpenChange} aria-label="Kalkuleringen tar tid">
            <Dialog.Popup width="450px">
                <Dialog.Header>
                    <Dialog.Title>Kalkuleringen ser ut til å ta noe tid</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    <BodyShort>Oppgaven vil dukke opp i oversikten når den er klar.</BodyShort>
                </Dialog.Body>
                <Dialog.Footer>
                    <Dialog.CloseTrigger>
                        <Button variant="tertiary" type="button">
                            Det er greit
                        </Button>
                    </Dialog.CloseTrigger>
                    <Dialog.CloseTrigger>
                        <Button as={NextLink} variant="secondary" href="/">
                            Tilbake til oversikten
                        </Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
}
