import React, { ReactElement, useState } from 'react';

import { Button, Dialog } from '@navikt/ds-react';

import { ApiUberegnetPeriode } from '@io/rest/generated/spesialist.schemas';

import { ForkastFraUberegnetDialogInnhold } from './ForkastFraUberegnetDialogInnhold';

interface ForkastFraUberegnetButtonProps {
    activePeriod: ApiUberegnetPeriode;
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
