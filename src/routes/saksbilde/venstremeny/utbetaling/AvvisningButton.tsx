import React, { ReactElement, useState } from 'react';

import { Button, Dialog } from '@navikt/ds-react';

import { BeregnetPeriodeFragment } from '@io/graphql';

import { AvvisningDialogInnhold } from './AvvisningDialogInnhold';

interface AvvisningButtonProps {
    activePeriod: BeregnetPeriodeFragment;
    disabled: boolean;
}

export const AvvisningButton = ({ activePeriod, disabled = false }: AvvisningButtonProps): ReactElement => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={(nextOpen) => setOpen(nextOpen)}>
            <Dialog.Trigger>
                <Button disabled={disabled} variant="secondary" size="small" data-testid="avvisning-button">
                    Kan ikke behandles her
                </Button>
            </Dialog.Trigger>
            <Dialog.Popup>
                <AvvisningDialogInnhold activePeriod={activePeriod} onSuccess={() => setOpen(false)} />
            </Dialog.Popup>
        </Dialog>
    );
};
