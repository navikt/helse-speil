'use client';

import nissemyra from '../assets/nissemyra.svg';
import Image from 'next/image';
import React, { ReactElement, useEffect } from 'react';

import { BodyShort, Heading, Link } from '@navikt/ds-react';

import { getFaro } from '@observability/faro';

import styles from './PageNotFound.module.css';

export const PageNotFound = (): ReactElement => {
    useEffect(() => {
        getFaro()?.api.pushError(new Error('404 - Page not found (vår egen)'));
    }, []);

    return (
        <main className={styles.PageNotFound}>
            <section>
                <BodyShort className={styles.ErrorText}>Feilkode: 404</BodyShort>
                <Heading className={styles.Heading} level="2" size="medium">
                    Oooops!
                    <br />
                    Nå havna vi langt ut i nissemyra
                </Heading>
                <Link href="/">Til oppgavelista</Link>
            </section>
            <Image
                alt="Agurk med armer og bein ikledd en lue som leser et kart"
                priority={true}
                src={nissemyra}
                unoptimized
            />
        </main>
    );
};
