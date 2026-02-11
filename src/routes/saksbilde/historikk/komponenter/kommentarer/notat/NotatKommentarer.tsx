import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { NotatKommentar } from '@saksbilde/historikk/komponenter/kommentarer/notat/NotatKommentar';
import { Kommentar as KommentarType } from '@typer/notat';

interface NotatKommentarerProps {
    kommentarer: KommentarType[];
    vedtaksperiodeId: string;
    dialogRef: number;
}

export const NotatKommentarer = ({
    kommentarer,
    vedtaksperiodeId,
    dialogRef,
}: NotatKommentarerProps): ReactElement | null => {
    if (kommentarer.length === 0) return null;

    return (
        <>
            <BodyShort size="small" weight="semibold">
                Kommentarer
            </BodyShort>
            {[...kommentarer]
                .sort((a, b) => new Date(a.opprettet).getTime() - new Date(b.opprettet).getTime())
                .map((kommentar, index) => (
                    <NotatKommentar
                        dialogRef={dialogRef}
                        vedtaksperiodeId={vedtaksperiodeId}
                        kommentar={kommentar}
                        key={index}
                    />
                ))}
        </>
    );
};
