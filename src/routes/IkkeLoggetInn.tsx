import { BodyShort, Link } from '@navikt/ds-react';

import styles from './IkkeLoggetInn.module.css';

export const IkkeLoggetInn = () => (
    <main className={styles.IkkeLoggetInn}>
        <BodyShort>Du må logge inn for å få tilgang til systemet</BodyShort>
        <Link href="/">Gå til innloggingssiden</Link>
    </main>
);
