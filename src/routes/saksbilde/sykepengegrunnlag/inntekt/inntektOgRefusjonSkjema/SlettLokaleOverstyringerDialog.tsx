import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { SlettLokaleEndringerDialog } from '@components/SlettLokaleEndringerDialog';
import { DateString } from '@typer/shared';

interface SlettLokaleOverstyringerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onApprove: () => void;
    skjæringstidspunkt: DateString;
    overstyrtSkjæringstidspunkt: DateString | null;
}

export function SlettLokaleOverstyringerDialog({
    open,
    onOpenChange,
    onApprove,
    skjæringstidspunkt,
    overstyrtSkjæringstidspunkt,
}: SlettLokaleOverstyringerDialogProps): ReactElement {
    return (
        <SlettLokaleEndringerDialog
            heading="Er du sikker på at du vil fortsette?"
            open={open}
            onOpenChange={onOpenChange}
            onApprove={onApprove}
        >
            <BodyShort>
                Ved å trykke ja lagrer du disse nye endringene for skjæringstidspunkt:{' '}
                <span className="font-semibold">{skjæringstidspunkt}</span>, <br /> og vil dermed overskrive lokale
                overstyringer lagret på skjæringstidspunkt:{' '}
                <span className="font-semibold">{overstyrtSkjæringstidspunkt ?? ''}</span>
            </BodyShort>
        </SlettLokaleEndringerDialog>
    );
}
