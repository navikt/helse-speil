import Link from 'next/link';
import React, { ReactElement } from 'react';

import styles from './SharedViews.module.css';

function PeriodeViewSkeleton(): ReactElement {
    return (
        <div className={styles.Content}>
            Klarte ikke å laste personen.
            <Link href="/">Klikk her for å gå tilbake til oppgaveoversikten</Link>
        </div>
    );
}

export default PeriodeViewSkeleton;
