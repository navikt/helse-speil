import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Kommentar as KommentarType } from '@typer/notat';

import { Kommentar } from './Kommentar';

interface KommentarerProps {
    kommentarer: KommentarType[];
    dialogRef: number | null;
}

export const Kommentarer = ({ kommentarer, dialogRef }: KommentarerProps): ReactElement | null => {
    if (kommentarer.length === 0) return null;

    return (
        <>
            <BodyShort size="small" weight="semibold">
                Kommentarer
            </BodyShort>
            {[...kommentarer]
                .sort((a, b) => new Date(a.opprettet).getTime() - new Date(b.opprettet).getTime())
                .map((kommentar, index) => (
                    <Kommentar dialogRef={dialogRef} kommentar={kommentar} key={index} />
                ))}
        </>
    );
};
