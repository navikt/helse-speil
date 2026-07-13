import React, { ReactElement } from 'react';

import { BodyShort, Button, Dialog } from '@navikt/ds-react';

interface BrukArbeidsforholdILikevelDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onApprove: () => void;
}

export function BrukArbeidsforholdILikevelDialog({
    open,
    onOpenChange,
    onApprove,
}: BrukArbeidsforholdILikevelDialogProps): ReactElement {
    return (
        <Dialog open={open} onOpenChange={onOpenChange} aria-label="Bruk arbeidsforholdet i beregningen likevel">
            <Dialog.Popup>
                <Dialog.Header>
                    <Dialog.Title>Vil du bruke arbeidsforholdet i beregningen likevel?</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    <BodyShort>Arbeidsforholdet vil bli tatt med i beregningen igjen.</BodyShort>
                </Dialog.Body>
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
