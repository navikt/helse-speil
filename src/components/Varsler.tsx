'use client';

import React from 'react';

import { Alert } from '@navikt/ds-react';

import { useVarsler } from '@state/varsler';

import styles from './Varsler.module.css';

export const Varsler = () => {
    const varsler = useVarsler();

    return (
        <div className={styles.varsler}>
            {varsler.map(({ name, severity, message }) => (
                <Alert key={name} variant={severity} size="small">
                    <span className={styles.varseltekst}>{message}</span>
                </Alert>
            ))}
        </div>
    );
};
