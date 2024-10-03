'use client';

import dayjs from 'dayjs';
import React from 'react';
import * as R from 'remeda';

import { Alert, BodyShort } from '@navikt/ds-react';

import { useDriftsmelding } from '@external/sanity';
import { getFormattedDatetimeString } from '@utils/date';

import styles from './Driftsmeldinger.module.scss';

export const Driftsmeldinger = () => {
    const { driftsmeldinger, loading, error } = useDriftsmelding();

    const Driftsmelding = ({
        level,
        children,
    }: {
        children?: React.ReactNode;
        level: 'info' | 'warning' | 'error' | 'success';
    }) => {
        const [show, setShow] = React.useState(true);

        return show ? (
            <Alert variant={level} closeButton={level === 'info' || level === 'success'} onClose={() => setShow(false)}>
                {children || 'Content'}
            </Alert>
        ) : null;
    };

    return R.sortBy(driftsmeldinger, [R.prop('opprettet'), 'desc']).map((it, index) => {
        const harGått30min = dayjs(it.opprettet).add(30, 'minutes').isBefore(dayjs());
        if (harGått30min && it.level === 'success') return null;

        return (
            <Driftsmelding key={index} level={it.level}>
                <BodyShort className={styles.tittel} weight="semibold">
                    {it.level === 'success' ? `[Løst] ${it.tittel}` : it.tittel}
                </BodyShort>
                <BodyShort>{it.melding}</BodyShort>
                <BodyShort className={styles.dato}>{getFormattedDatetimeString(it.opprettet.toString())}</BodyShort>
            </Driftsmelding>
        );
    });
};
