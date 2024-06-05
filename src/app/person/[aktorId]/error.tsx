'use client';

import styles from './periodeview.module.scss';
import React from 'react';

import { Alert } from '@navikt/ds-react';

function Error({ error }: { error: Error & { digest?: string } }) {
    return (
        <Alert variant="error" size="small" className={styles.error}>
            {error.message}
        </Alert>
    );
}

export default Error;
