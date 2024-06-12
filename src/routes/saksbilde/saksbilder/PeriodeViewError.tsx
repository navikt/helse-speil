import Link from 'next/link';
import React, { ReactElement } from 'react';

import styles from './SharedViews.module.css';

export const PeriodeViewError = (): ReactElement => (
    <div className={styles.Content}>
        Klarte ikke å laste personen.
        <Link href="/">Klikk her for å gå tilbake til oppgaveoversikten</Link>
    </div>
);
