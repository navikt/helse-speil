import React, { ReactElement } from 'react';

import { Alert, BodyShort } from '@navikt/ds-react';

import styles from './GlobalFeilside.module.css';

interface GlobalFeilsideProps {
    error: Error;
}

export const GlobalFeilside = ({ error }: GlobalFeilsideProps): ReactElement => {
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
                    <BodyShort weight="semibold">Teknisk feilmelding for utviklere:</BodyShort>
                    {error.stack}
                </pre>
            </main>
        </>
    );
};
