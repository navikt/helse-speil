import React from 'react';

import { useVarsler } from '@state/varsler';
import { Alert } from '@navikt/ds-react';

import styles from './Varsler.module.css';

export const Varsler = () => {
    const varsler = useVarsler();

    return (
        <div className={styles.Varsler}>
            {varsler.map(({ name, severity, message }) => (
                <Alert key={name} variant={severity} size="small">
                    {message}
                </Alert>
            ))}
        </div>
    );
};
