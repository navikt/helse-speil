'use client';

import styles from './error.module.scss';
import React, { useEffect } from 'react';

import { Alert } from '@navikt/ds-react';

import { getFaro } from '@observability/faro';

export default function Error({ error }: { error: Error & { digest?: string } }) {
    useEffect(() => {
        console.error(error);
        getFaro()?.api.pushError(error);
    }, [error]);

    return (
        <Alert variant="error" size="small" className={styles.error}>
            {error.message}
        </Alert>
    );
}
