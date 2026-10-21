import React, { ReactElement, useState } from 'react';

import { Button, Dialog } from '@navikt/ds-react';

import { ApiBeregnetPeriode } from '@io/rest/generated/spesialist.schemas';

import { AvvisningDialogInnhold } from './AvvisningDialogInnhold';

interface AvvisningButtonProps {
    activePeriod: ApiBeregnetPeriode;
    disabled: boolean;
}

export const AvvisningButton = ({ activePeriod, disabled = false }: AvvisningButtonProps): ReactElement => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
