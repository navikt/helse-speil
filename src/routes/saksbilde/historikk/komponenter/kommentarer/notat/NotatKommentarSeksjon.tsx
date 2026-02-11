import React, { ReactElement, useState } from 'react';

import { ReadMore } from '@navikt/ds-react';

import { LeggTilNotatKommentar } from '@saksbilde/historikk/komponenter/kommentarer/notat/LeggTilNotatKommentar';
import { NotatKommentarer } from '@saksbilde/historikk/komponenter/kommentarer/notat/NotatKommentarer';
import { Kommentar } from '@typer/notat';

type NotatKommentarSeksjonProps = {
    kommentarer: Kommentar[];
    vedtaksperiodeId: string;
    dialogRef: number;
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
                    <NotatKommentarer
                        kommentarer={kommentarer}
                        vedtaksperiodeId={vedtaksperiodeId}
                        dialogRef={dialogRef}
                    />
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
