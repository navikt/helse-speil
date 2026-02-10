import React, { ReactElement, useState } from 'react';

import { ReadMore } from '@navikt/ds-react';

import { PeriodehistorikkType } from '@io/graphql';
import { Kommentarer } from '@saksbilde/historikk/komponenter/kommentarer/Kommentarer';
import { LeggTilHendelseKommentar } from '@saksbilde/historikk/komponenter/kommentarer/hendelse/LeggTilHendelseKommentar';
import { Kommentar } from '@typer/notat';

type HendelseKommentarSeksjonProps = {
    kommentarer: Kommentar[];
    dialogRef?: number;
    historikkinnslagId: number;
    historikktype?: PeriodehistorikkType;
};

export const HendelseKommentarSeksjon = ({
    kommentarer,
    dialogRef,
    historikkinnslagId,
    historikktype,
}: HendelseKommentarSeksjonProps): ReactElement => {
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
                <LeggTilHendelseKommentar
                    dialogRef={dialogRef}
                    historikkinnslagId={historikkinnslagId}
                    åpneKommentarvisning={() => setOpen(true)}
                    historikktype={historikktype}
                />
            )}
        </>
    );
};
