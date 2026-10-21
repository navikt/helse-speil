import React, { ReactElement, useState } from 'react';

import { ReadMore } from '@navikt/ds-react';

import { HendelseKommentarer } from '@saksbilde/historikk/komponenter/kommentarer/hendelse/HendelseKommentarer';
import { LeggTilHendelseKommentar } from '@saksbilde/historikk/komponenter/kommentarer/hendelse/LeggTilHendelseKommentar';
import { Kommentar } from '@typer/notat';

type HendelseKommentarSeksjonProps = {
    kommentarer: Kommentar[];
    dialogRef: number;
    historikkinnslagId: number;
};

export const HendelseKommentarSeksjon = ({
    kommentarer,
    dialogRef,
    historikkinnslagId,
}: HendelseKommentarSeksjonProps): ReactElement | null => {
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
                    <HendelseKommentarer kommentarer={kommentarer} dialogRef={dialogRef} />
                </ReadMore>
            )}
            <LeggTilHendelseKommentar
                dialogRef={dialogRef}
                historikkinnslagId={historikkinnslagId}
                åpneKommentarvisning={() => setOpen(true)}
            />
        </>
    );
};
