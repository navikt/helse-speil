import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Kommentar } from '@io/graphql';

import { NotatKommentar } from './NotatKommentar';

import styles from './Kommentarer.module.css';

interface KommentarerProps {
    kommentarer: Array<Kommentar>;
    saksbehandlerOid: string;
}

export const Kommentarer = ({ kommentarer, saksbehandlerOid }: KommentarerProps): ReactElement | null => {
    if (kommentarer.length === 0) return null;

    return (
        <div className={styles.Kommentarer}>
            <BodyShort size="small">Kommentarer</BodyShort>
            {[...kommentarer]
                .sort((a, b) => new Date(a.opprettet).getTime() - new Date(b.opprettet).getTime())
                .map((kommentar, index) => (
                    <NotatKommentar kommentar={kommentar} forfatterSaksbehandlerOid={saksbehandlerOid} key={index} />
                ))}
        </div>
    );
};
