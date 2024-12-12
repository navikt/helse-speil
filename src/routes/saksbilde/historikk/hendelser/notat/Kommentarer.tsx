import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Kommentar, Maybe } from '@io/graphql';

import { NotatKommentar } from './NotatKommentar';

import styles from './Kommentarer.module.css';

interface KommentarerProps {
    kommentarer: Array<Kommentar>;
    readOnly: boolean;
}

export const Kommentarer = ({ kommentarer, readOnly }: KommentarerProps): Maybe<ReactElement> => {
    if (kommentarer.length === 0) return null;

    return (
        <div className={styles.Kommentarer}>
            <BodyShort size="small">Kommentarer</BodyShort>
            {[...kommentarer]
                .sort((a, b) => new Date(a.opprettet).getTime() - new Date(b.opprettet).getTime())
                .map((kommentar, index) => (
                    <NotatKommentar kommentar={kommentar} readOnly={readOnly} key={index} />
                ))}
        </div>
    );
};
