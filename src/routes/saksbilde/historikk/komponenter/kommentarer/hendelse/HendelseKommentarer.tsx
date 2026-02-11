import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Kommentar as KommentarType } from '@typer/notat';

import { HendelseKommentar } from './HendelseKommentar';

interface HendelseKommentarerProps {
    kommentarer: KommentarType[];
    dialogRef: number;
}

export const HendelseKommentarer = ({ kommentarer, dialogRef }: HendelseKommentarerProps): ReactElement | null => {
    if (kommentarer.length === 0) return null;

    return (
        <>
            <BodyShort size="small" weight="semibold">
                Kommentarer
            </BodyShort>
            {[...kommentarer]
                .sort((a, b) => new Date(a.opprettet).getTime() - new Date(b.opprettet).getTime())
                .map((kommentar, index) => (
                    <HendelseKommentar dialogRef={dialogRef} kommentar={kommentar} key={index} />
                ))}
        </>
    );
};
