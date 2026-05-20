import React, { ReactElement, useState } from 'react';

import { Button, Dialog } from '@navikt/ds-react';

import { UberegnetPeriodeFragment } from '@io/graphql';

import { ForkastFraUberegnetDialogInnhold } from './ForkastFraUberegnetDialogInnhold';

interface ForkastFraUberegnetButtonProps {
    activePeriod: UberegnetPeriodeFragment;
}

export const ForkastFraUberegnetButton = ({ activePeriod }: ForkastFraUberegnetButtonProps): ReactElement => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>
                <Button className="w-fit" variant="secondary" size="small">
                    Kan ikke behandles her
                </Button>
            </Dialog.Trigger>
            <Dialog.Popup>
                <ForkastFraUberegnetDialogInnhold activePeriod={activePeriod} onSuccess={() => setOpen(false)} />
            </Dialog.Popup>
        </Dialog>
    );
};
