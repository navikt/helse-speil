import React, { ReactElement } from 'react';

import { Kommentar, Maybe, PeriodehistorikkType } from '@io/graphql';
import { Expandable } from '@saksbilde/historikk/hendelser/Expandable';
import { Kommentarer } from '@saksbilde/historikk/komponenter/kommentarer/Kommentarer';
import { LeggTilNyKommentar } from '@saksbilde/historikk/komponenter/kommentarer/LeggTilNyKommentar';

type KommentarSeksjonProps = {
    kommentarer: Array<Kommentar>;
    dialogRef: Maybe<number>;
    historikkinnslagId: number;
    historikktype?: PeriodehistorikkType;
};

export const KommentarSeksjon = ({
    kommentarer,
    dialogRef,
    historikkinnslagId,
    historikktype,
}: KommentarSeksjonProps): ReactElement => (
    <>
        {kommentarer?.length > 0 && (
            <Expandable expandText={`Kommentarer (${kommentarer?.length})`} collapseText="Lukk kommentarer">
                <Kommentarer kommentarer={kommentarer} readOnly={false} />
            </Expandable>
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
