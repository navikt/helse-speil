import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Kommentar as GraphQLKommentar } from '@io/graphql';

import { Kommentar } from './Kommentar';

import styles from './Kommentarer.module.css';

interface KommentarerProps {
    kommentarer: Array<GraphQLKommentar>;
}

export const Kommentarer = ({ kommentarer }: KommentarerProps): ReactElement | null => {
    if (kommentarer.length === 0) return null;

    return (
        <div className={styles.Kommentarer}>
            <BodyShort size="small">Kommentarer</BodyShort>
            {[...kommentarer]
                .sort((a, b) => new Date(a.opprettet).getTime() - new Date(b.opprettet).getTime())
                .map((kommentar, index) => (
                    <Kommentar kommentar={kommentar} key={index} />
                ))}
        </div>
    );
};
