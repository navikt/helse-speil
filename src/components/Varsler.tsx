'use client';

import React from 'react';

import { Alert } from '@navikt/ds-react';

import { TildelingAlert } from '@state/oppgaver';
import { useVarsler } from '@state/varsler';

import styles from './Varsler.module.css';

export const Varsler = () => {
    const varsler = useVarsler();

    return (
        <div className={styles.varsler}>
            {varsler.map((varsel) => (
                <Alert key={varsel.name} variant={varsel.severity} size="small">
                    <span className={styles.varseltekst}>
                        {varsel instanceof TildelingAlert ? (
                            <>
                                Oppgaven er tildelt <span data-sensitive>{varsel.tildeltNavn}</span>
                            </>
                        ) : (
                            varsel.message
                        )}
                    </span>
                </Alert>
            ))}
        </div>
    );
};
