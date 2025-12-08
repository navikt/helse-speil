import React, { ReactElement, useState } from 'react';

import { ReadMore } from '@navikt/ds-react';

import { Kommentar, PeriodehistorikkType } from '@io/graphql';
import { Kommentarer } from '@saksbilde/historikk/komponenter/kommentarer/Kommentarer';
import { LeggTilNyKommentar } from '@saksbilde/historikk/komponenter/kommentarer/LeggTilNyKommentar';

type KommentarSeksjonProps = {
    kommentarer: Kommentar[];
    dialogRef?: number;
    historikkinnslagId: number;
    historikktype?: PeriodehistorikkType;
};

export const KommentarSeksjon = ({
    kommentarer,
    dialogRef,
    historikkinnslagId,
    historikktype,
}: KommentarSeksjonProps): ReactElement => {
    const [open, setOpen] = useState(false);
    const antall = kommentarer?.length ?? 0;
    return (
        <>
            {antall > 0 && (
                <ReadMore
                    onClick={() => setOpen(!open)}
                    size="small"
                    header={open ? `Kommentarer (${kommentarer?.length})` : 'Lukk kommentarer'}
                >
                    <Kommentarer kommentarer={kommentarer} />
                </ReadMore>
            )}
            {dialogRef && (
                <LeggTilNyKommentar
                    historikktype={historikktype}
                    dialogRef={dialogRef}
                    historikkinnslagId={historikkinnslagId}
                />
            )}
        </>
    );
};
