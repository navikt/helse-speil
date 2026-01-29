import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Kommentar as GraphQLKommentar } from '@io/graphql';

import { Kommentar } from './Kommentar';

interface KommentarerProps {
    kommentarer: GraphQLKommentar[];
}

export const Kommentarer = ({ kommentarer }: KommentarerProps): ReactElement | null => {
    if (kommentarer.length === 0) return null;

    return (
        <>
            <BodyShort size="small" weight="semibold">
                Kommentarer
            </BodyShort>
            {[...kommentarer]
                .sort((a, b) => new Date(a.opprettet).getTime() - new Date(b.opprettet).getTime())
                .map((kommentar, index) => (
                    <Kommentar kommentar={kommentar} key={index} />
                ))}
        </>
    );
};
