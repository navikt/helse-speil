'use client';

import React, { useEffect } from 'react';

import { Alert } from '@navikt/ds-react';

import { getFaro } from '@observability/faro';

import styles from './error.module.scss';

export default function Error({ error }: { error: Error & { digest?: string } }) {
    useEffect(() => {
        // eslint-disable-next-line no-console
        console.error(error);
        getFaro()?.api.pushError(error);
    }, [error]);

    return (
        <Alert variant="error" size="small" className={styles.error}>
            {error.message}
        </Alert>
    );
}
