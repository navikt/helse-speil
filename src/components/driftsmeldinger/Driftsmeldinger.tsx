'use client';

import React from 'react';
import * as R from 'remeda';

import { Alert, BodyShort } from '@navikt/ds-react';

import { useDriftsmelding } from '@external/sanity';
import { getFormattedDatetimeString } from '@utils/date';

import styles from './Driftsmeldinger.module.scss';

export const Driftsmeldinger = () => {
    const { driftsmeldinger, loading, error } = useDriftsmelding();

    const nivåTilVariant = (level: 'info' | 'warning' | 'error') => {
        switch (level) {
            case 'info':
                return 'info';
            case 'warning':
                return 'warning';
            case 'error':
                return 'error';
        }
    };

    return R.sortBy(driftsmeldinger, [R.prop('opprettet'), 'desc']).map((it, index) => (
        <Alert key={index} variant={nivåTilVariant(it.level)} className={styles.driftsmelding}>
            <BodyShort className={styles.tittel} weight="semibold">
                {it.tittel}
            </BodyShort>
            <BodyShort>{it.melding}</BodyShort>
            <BodyShort className={styles.dato}>{getFormattedDatetimeString(it.opprettet.toString())}</BodyShort>
        </Alert>
    ));
};
