import React, { PropsWithChildren, ReactElement } from 'react';

import { Button, Dialog } from '@navikt/ds-react';

interface SlettLokaleEndringerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onApprove: () => void;
    heading: string;
}

export function SlettLokaleEndringerDialog({
    open,
    onOpenChange,
    onApprove,
    heading,
    children,
}: PropsWithChildren<SlettLokaleEndringerDialogProps>): ReactElement {
    return (
        <Dialog open={open} onOpenChange={onOpenChange} aria-label="Slett lokale endringer">
            <Dialog.Popup>
                <Dialog.Header>
                    <Dialog.Title>{heading}</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>{children}</Dialog.Body>
                <Dialog.Footer>
                    <Dialog.CloseTrigger>
                        <Button variant="tertiary" type="button">
                            Avbryt
                        </Button>
                    </Dialog.CloseTrigger>
                    <Dialog.CloseTrigger>
                        <Button variant="primary" type="button" onClick={onApprove}>
                            Ja
                        </Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
}
