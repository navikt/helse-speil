import React from 'react';

import { Alert } from '@navikt/ds-react';

import { Bold } from '@components/Bold';

import styles from './GlobalFeilside.module.css';

interface GlobalFeilsideProps {
    error: Error;
}

export const GlobalFeilside: React.FC<GlobalFeilsideProps> = ({ error }) => {
    return (
        <>
            <Alert size="small" variant="error" className={styles.Alert}>
                Det har skjedd en feil. Siden kan dessverre ikke vises
            </Alert>
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
