import nissemyra from '../assets/nissemyra.svg';
import React from 'react';

import { BodyShort, Heading, Link } from '@navikt/ds-react';

import styles from './PageNotFound.module.css';

export const PageNotFound = () => {
    return (
        <main className={styles.PageNotFound}>
            <section>
                <BodyShort className={styles.ErrorText}>Feilkode: 404</BodyShort>
                <Heading className={styles.Heading} as="h2" size="medium">
                    Oooops!
                    <br />
                    Nå havna vi langt ut i nissemyra
                </Heading>
                <Link href="/">Til oppgavelista</Link>
            </section>
            <img alt="Agurk med armer og bein ikledd en lue som leser et kart" src={nissemyra.src} />
        </main>
    );
};
