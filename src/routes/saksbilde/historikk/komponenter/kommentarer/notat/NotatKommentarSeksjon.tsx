import React, { ReactElement, useState } from 'react';

import { ReadMore } from '@navikt/ds-react';

import { Kommentarer } from '@saksbilde/historikk/komponenter/kommentarer/Kommentarer';
import { LeggTilNotatKommentar } from '@saksbilde/historikk/komponenter/kommentarer/notat/LeggTilNotatKommentar';
import { Kommentar } from '@typer/notat';

type NotatKommentarSeksjonProps = {
    kommentarer: Kommentar[];
    vedtaksperiodeId: string;
    dialogRef?: number;
};
export const NotatKommentarSeksjon = ({
    kommentarer,
    vedtaksperiodeId,
    dialogRef,
}: NotatKommentarSeksjonProps): ReactElement => {
    const [open, setOpen] = useState(false);
    const antall = kommentarer?.length ?? 0;

    return (
        <>
            {antall > 0 && (
                <ReadMore
                    onClick={() => setOpen(!open)}
                    open={open}
                    size="small"
                    header={open ? 'Lukk kommentarer' : `Kommentarer (${kommentarer?.length})`}
                >
                    <Kommentarer kommentarer={kommentarer} dialogRef={dialogRef ?? null} />
                </ReadMore>
            )}
            {dialogRef && (
                <LeggTilNotatKommentar
                    dialogRef={dialogRef}
                    vedtaksperiodeId={vedtaksperiodeId}
                    åpneKommentarvisning={() => setOpen(true)}
                />
            )}
        </>
    );
};
