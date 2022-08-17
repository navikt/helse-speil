import React from 'react';

import { Bold } from '@components/Bold';
import { Varsel } from '@components/Varsel';
import { Header } from '@navikt/ds-react-internal';

import styles from './GlobalFeilside.module.css';

export const GlobalFeilside = (error: Error) => {
    console.log(error.stack, error.name);
    return (
        <>
            <Header>
                <Header.Title as="h1" className={styles.Title}>
                    NAV Sykepenger
                </Header.Title>
            </Header>
            <Varsel variant="error">Det har skjedd en feil. Siden kan dessverre ikke vises</Varsel>
            <main className={styles.Content}>
                <p>
                    Du kan forsøke å laste siden på nytt, eller lukke nettleservinduet og logge inn på nytt.
                    <br />
                    Ta kontakt med en utvikler hvis feilen fortsetter.
                </p>
                <pre className={styles.TechnicalErrorMessage}>
                    <Bold>Teknisk feilmelding for utviklere:</Bold>
                    {error.stack}
                </pre>
            </main>
        </>
    );
};
